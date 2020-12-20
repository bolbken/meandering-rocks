# data.terraform_remote_state.common.

resource "aws_iam_role" "codebuild" {
  name               = "meandering-rocks-codebuild-role-production"
  assume_role_policy = data.terraform_remote_state.common.aws_iam_policy_document.codebuild_role.json

  tags = {
    project     = "meandering.rocks"
    environment = "production"
    component   = "build"
  }
}

resource "aws_iam_role_policy" "codebuild" {
  role   = aws_iam_role.codebuild.name
  name   = "meandering-rocks-codebuild-policy-production"
  policy = data.terraform_remote_state.common.data.aws_iam_policy_document.codebuild.json
}

data "aws_iam_policy_document" "cloudfront" {
  statement {
    sid = "cloudfront"
    actions = [
      "cloudfront:GetDistribution",
      "cloudfront:GetDistributionConfig",
      "cloudfront:UpdateDistribution",
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation",
      "cloudfront:ListInvalidations"
    ]
    resources = [aws_cloudfront_distribution.production.arn]
  }
}

resource "aws_iam_policy" "cloudfront" {
  name   = "meandering-rocks-codebuild-cloudfront-policy-production"
  policy = data.aws_iam_policy_document.cloudfront.json
}

resource "aws_iam_role_policy_attachment" "cloudfront" {
  role       = aws_iam_rol3.codebuild.name
  policy_arn = aws_iam_policy.cloudfront.arn
}

resource "aws_codebuild_project" "production" {

  name          = "meandering-rocks-build-production"
  description   = "Build the source code of meandering-rocks master branch and deploy to production."
  build_timeout = "5"
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:3.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      TARGET_ADDRESS          = local.target_address
      TARGET_BUCKET_NAME      = aws_s3_bucket.production.id
      CLOUDFRONT_DISTRIBUTION = aws_cloudfront_distribution.production.id
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/bolbken/meandering-rocks.git"
    git_clone_depth = 1
  }

  source_version = "master"

  tags = {
    project     = "meandering.rocks"
    environment = "production"
    component   = "build"
  }
}

resource "aws_codebuild_webhook" "production" {
  project_name = aws_codebuild_project.production.name

  filter_group {
    filter {
      exclude_matched_pattern = false
      pattern                 = "PUSH, PULL_REQUEST_CREATED, PULL_REQUEST_UPDATED, PULL_REQUEST_REOPENED, PULL_REQUEST_MERGED"
      type                    = "EVENT"
    }
    filter {
      exclude_matched_pattern = false
      pattern                 = "^refs/heads/master$"
      type                    = "HEAD_REF"
    }
  }
}
