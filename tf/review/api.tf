locals {
  domain_name = "api.dev.meandering.rocks"
}

resource "aws_api_gateway_stage" "review" {
  stage_name    = "review"
  rest_api_id   = data.terraform_remote_state.common.aws_api_gateway_rest_api.common.id
  deployment_id = aws_api_gateway_deployment.review.id
}

resource "aws_api_gateway_deployment" "review" {
  rest_api_id = data.terraform_remote_state.common.aws_api_gateway_rest_api.common.id
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

resource "aws_api_gateway_base_path_mapping" "review" {
  api_id      = data.terraform_remote_state.common.aws_api_gateway_rest_api.common.id
  domain_name = local.domain_name
  id          = "${local.domain_name}/"
  stage_name  = aws_api_gateway_stage.review.stage_name
}

data "aws_iam_policy_document" "redirect_service_lambda" {
  statement {
    sid       = "kms-decrypt"
    actions   = ["kms:Decrypt"]
    resources = [data.terraform_remote_state.common.aws_kms_key.common.arn]
  }

  statement {
    sid       = "s3-get-site-bucket"
    actions   = ["s3:GetObject", "s3:GetObjectVersion"]
    resources = [aws_s3_bucket.review.arn, "${aws_s3_bucket.review.arn}/*"]
  }
}

resource "aws_iam_role" "redirect_service_lambda" {
  name               = "meandering-rocks-api-redirect-service-lambda-role"
  assume_role_policy = data.terraform_remote_state.common.data.aws_iam_policy_document.lambda_role.json
}

resource "aws_iam_role_policy" "newsletter_service_lambda" {
  name   = "meandering-rocks-api-redirect-service-lambda-execution-policy"
  role   = aws_iam_role.redirect_service_lambda.id
  policy = data.aws_iam_policy_document.redirect_service_lambda.json
}
