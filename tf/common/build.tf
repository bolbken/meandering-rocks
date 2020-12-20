terraform {
  backend "s3" {
    bucket = "meandering-rocks-configuration"
    key    = "terraform/common/.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}


resource "aws_s3_bucket" "artifacts" {
  bucket = "meandering-rocks-artifacts"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    project     = "meandering.rocks"
    environment = "build"
  }
}

resource "aws_iam_role" "codebuild" {
  name = "meandering-rocks-codebuild-policy"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  tags = {
    project     = "meandering.rocks"
    environment = "build"
  }
}

resource "aws_iam_role_policy" "codebuild" {
  role = aws_iam_role.codebuild.name
  name = "meandering-rocks-codebuild-policy"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Resource": [
        "*"
      ],
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "${aws_s3_bucket.artifacts.arn}",
        "${aws_s3_bucket.artifacts.arn}/*"
      ]
    }
  ]
}
POLICY
}

resource "aws_codebuild_project" "codebuild" {

  name          = "meandering-rocks-build"
  description   = "Build the source code of meandering-rocks and deploy."
  build_timeout = "5"
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  # cache {
  #   type     = "S3"
  #   location = aws_s3_bucket.artifacts.bucket
  # }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:3.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    # environment_variable {
    #   name  = "SOME_KEY1"
    #   value = "SOME_VALUE1"
    # }
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }

    s3_logs {
      status   = "ENABLED"
      location = "${aws_s3_bucket.artifacts.id}/build-log"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/bolbken/meandering-rocks.git"
    git_clone_depth = 1
  }

  # source_version = "master"

  tags = {
    project     = "meandering.rocks"
    environment = "build"
  }
}
