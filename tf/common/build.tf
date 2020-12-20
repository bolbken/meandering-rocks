
resource "aws_s3_bucket" "artifacts" {
  bucket = "meandering-rocks-artifacts"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    project   = "meandering.rocks"
    component = "build"
  }
}

data "aws_iam_policy_document" "codebuild_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = "codebuild.amazonaws.com"
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


