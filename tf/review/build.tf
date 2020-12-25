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
    sid = "iam"
    actions = [
      "iam:AttachRolePolicy",
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:DeleteRolePolicy",
      "iam:DetachRolePolicy",
      "iam:GetRole",
      "iam:PassRole",
      "iam:PutRolePolicy"
    ]
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
  name               = "meandering-rocks-codebuild-role-review"
  assume_role_policy = data.aws_iam_policy_document.codebuild_role.json

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "build"
  }
}

resource "aws_iam_role_policy" "codebuild" {
  role   = aws_iam_role.codebuild.name
  name   = "meandering-rocks-codebuild-policy-review"
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
    resources = [aws_cloudfront_distribution.review.arn]
  }
}

resource "aws_iam_policy" "cloudfront" {
  name   = "meandering-rocks-codebuild-cloudfront-policy-review"
  policy = data.aws_iam_policy_document.cloudfront.json
}

resource "aws_iam_role_policy_attachment" "cloudfront" {
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.cloudfront.arn
}

resource "aws_cloudwatch_log_group" "build_review" {
  name = "meandering-rocks-build-review"

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "build"
  }
}

data "aws_iam_policy_document" "build_logs_review" {
  statement {
    sid = "cloudwatchLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      aws_cloudwatch_log_group.build_review.arn,
      "${aws_cloudwatch_log_group.build_review.arn}:*"
    ]
  }

}

resource "aws_iam_policy" "build_logs_review" {
  name   = "meandering-rocks-cloudwatch-build-logs-policy-review"
  policy = data.aws_iam_policy_document.build_logs_review.json
}

resource "aws_iam_role_policy_attachment" "build_logs_review" {
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.build_logs_review.arn
}

resource "aws_codebuild_project" "review" {

  name          = "meandering-rocks-build-review"
  description   = "Build the source code of meandering-rocks review branch and deploy to stage."
  build_timeout = "20"
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
      name  = "TARGET_ADDRESS"
      value = local.target_address
    }

    environment_variable {
      name  = "TARGET_BUCKET_NAME"
      value = aws_s3_bucket.review.id
    }

    environment_variable {
      name  = "CLOUDFRONT_DISTRIBUTION"
      value = aws_cloudfront_distribution.review.id
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name  = aws_cloudwatch_log_group.build_review.name
      stream_name = "codebuild"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/bolbken/meandering-rocks.git"
    git_clone_depth = 1
  }

  source_version = "review"

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "build"
  }
}

resource "aws_codebuild_webhook" "review" {
  project_name = aws_codebuild_project.review.name

  filter_group {
    filter {
      exclude_matched_pattern = false
      pattern                 = "PUSH, PULL_REQUEST_CREATED, PULL_REQUEST_UPDATED, PULL_REQUEST_REOPENED, PULL_REQUEST_MERGED"
      type                    = "EVENT"
    }
    filter {
      exclude_matched_pattern = false
      pattern                 = "^refs/heads/review$"
      type                    = "HEAD_REF"
    }
  }
}
