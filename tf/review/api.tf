locals {
  domain_name = "api.dev.meandering.rocks"
}

resource "aws_api_gateway_domain_name" "review" {
  domain_name              = local.domain_name
  regional_certificate_arn = "arn:aws:acm:us-east-1:310674449483:certificate/0e6ca20b-9e39-4fde-9289-0785248bdf9e"
  security_policy          = "TLS_1_2"

  endpoint_configuration {
    types = [
      "REGIONAL",
    ]
  }

  tags = {
    "environment" = "review"
    "project"     = "meandering.rocks"
    "component"   = "api"
  }
}

# resource "aws_api_gateway_base_path_mapping" "review" {
#   api_id      = data.terraform_remote_state.common.outputs.api_gateway_id
#   domain_name = local.domain_name
#   stage_name  = aws_api_gateway_stage.review.stage_name
# }

data "aws_iam_policy_document" "redirect_service_lambda" {
  statement {
    sid       = "kmsDecrypt"
    actions   = ["kms:Decrypt"]
    resources = [data.terraform_remote_state.common.outputs.kms_arn]
  }

  statement {
    sid       = "s3GetSiteBucket"
    actions   = ["s3:GetObject", "s3:GetObjectVersion"]
    resources = [aws_s3_bucket.review.arn, "${aws_s3_bucket.review.arn}/*"]
  }
}

data "aws_iam_policy_document" "lambda_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "redirect_service_lambda" {
  name               = "meandering-rocks-api-redirect-service-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_role.json
}

resource "aws_iam_role_policy" "newsletter_service_lambda" {
  name   = "meandering-rocks-api-redirect-service-lambda-execution-policy"
  role   = aws_iam_role.redirect_service_lambda.id
  policy = data.aws_iam_policy_document.redirect_service_lambda.json
}
