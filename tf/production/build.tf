data "aws_iam_policy_document" "codebuild_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "codebuild_base" {
  statement {
    sid       = "apigateway"
    actions   = ["apigateway:*"]
    resources = ["*"]
  }

  statement {
    sid = "cloudformation"
    actions = [
      "cloudformation:CancelUpdateStack",
      "cloudformation:ContinueUpdateRollback",
      "cloudformation:CreateChangeSet",
      "cloudformation:CreateStack",
      "cloudformation:CreateUploadBucket",
      "cloudformation:DeleteStack",
      "cloudformation:Describe*",
      "cloudformation:EstimateTemplateCost",
      "cloudformation:ExecuteChangeSet",
      "cloudformation:Get*",
      "cloudformation:List*",
      "cloudformation:UpdateStack",
      "cloudformation:UpdateTerminationProtection",
      "cloudformation:ValidateTemplate"
    ]
    resources = ["*"]
  }

  statement {
    sid = "dynamodb"
    actions = [
      "dynamodb:CreateTable",
      "dynamodb:DeleteTable",
      "dynamodb:DescribeTable",
      "dynamodb:DescribeTimeToLive",
      "dynamodb:UpdateTimeToLive"
    ]
    resources = ["*"]
  }

  statement {
    sid = "events"
    actions = [
      "events:DeleteRule",
      "events:DescribeRule",
      "events:ListRuleNamesByTarget",
      "events:ListRules",
      "events:ListTargetsByRule",
      "events:PutRule",
      "events:PutTargets",
      "events:RemoveTargets"
    ]
    resources = ["*"]
  }

  statement {
    sid       = "iam"
    actions   = ["*"]
    resources = ["*"]
  }

  statement {
    sid = "lambda"
    actions = [
      "lambda:*"
    ]
    resources = ["*"]
  }

  statement {
    sid = "logs"
    actions = [
      "logs:CreateLogGroup",
      "logs:DeleteLogGroup",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:FilterLogEvents",
      "logs:GetLogEvents",
      "logs:PutSubscriptionFilter"
    ]
    resources = ["*"]
  }

  statement {
    sid = "s3"
    actions = [
      "s3:CreateBucket",
      "s3:DeleteBucket",
      "s3:DeleteBucketPolicy",
      "s3:DeleteObject",
      "s3:DeleteObjectVersion",
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:ListAllMyBuckets",
      "s3:ListBucket",
      "s3:PutBucketNotification",
      "s3:PutBucketPolicy",
      "s3:PutBucketTagging",
      "s3:PutBucketWebsite",
      "s3:PutEncryptionConfiguration",
      "s3:PutObject"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role" "codebuild" {
  name               = "meandering-rocks-codebuild-role-production"
  assume_role_policy = data.aws_iam_policy_document.codebuild_role.json

  tags = {
    project     = "meandering.rocks"
    environment = "production"
    component   = "build"
  }
}

resource "aws_iam_role_policy" "codebuild" {
  role   = aws_iam_role.codebuild.name
  name   = "meandering-rocks-codebuild-policy-production"
  policy = data.aws_iam_policy_document.codebuild_base.json
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
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.cloudfront.arn
}

resource "aws_cloudwatch_log_group" "build_production" {
  name = "meandering-rocks-build-production"

  tags = {
    project     = "meandering.rocks"
    environment = "production"
    component   = "build"
  }
}

data "aws_iam_policy_document" "build_logs_production" {
  statement {
    sid = "cloudwatchLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      aws_cloudwatch_log_group.build_production.arn,
      "${aws_cloudwatch_log_group.build_production.arn}:*"
    ]
  }

}

resource "aws_iam_policy" "build_logs_production" {
  name   = "meandering-rocks-cloudwatch-build-logs-policy-production"
  policy = data.aws_iam_policy_document.build_logs_production.json
}

resource "aws_iam_role_policy_attachment" "build_logs_production" {
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.build_logs_production.arn
}

data "aws_iam_policy_document" "build_kms_keys" {
  statement {
    sid     = "kmsDecrypt"
    actions = ["kms:*"]
    resources = [
      data.terraform_remote_state.common.outputs.kms_arn,
      "arn:aws:kms:us-east-1:310674449483:key/68a6d54c-be86-4cda-93aa-6604a191413c"
    ]
  }

}

resource "aws_iam_policy" "build_kms_keys" {
  name   = "meandering-rocks-codebuild-kms-keys-policy-production"
  policy = data.aws_iam_policy_document.build_kms_keys.json
}

resource "aws_iam_role_policy_attachment" "build_kms_keys" {
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.build_kms_keys.arn
}

resource "aws_codebuild_project" "production" {

  name          = "meandering-rocks-build-production"
  description   = "Build the source code of meandering-rocks master branch and deploy to production."
  build_timeout = "30"
  service_role  = aws_iam_role.codebuild.arn
  badge_enabled = true

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_MEDIUM"
    image                       = "aws/codebuild/standard:3.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      # TF Output
      name  = "CLOUDFRONT_DISTRIBUTION"
      value = aws_cloudfront_distribution.production.id
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name  = aws_cloudwatch_log_group.build_production.name
      stream_name = "codebuild"
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
