data "aws_acm_certificate" "api_review" {
  domain   = var.api_domain
  statuses = ["ISSUED"]
}

resource "aws_api_gateway_rest_api" "review" {
  api_key_source = "HEADER"
  name           = "meandering-rocks-api-gateway-review"

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "api"
  }
}

resource "aws_api_gateway_domain_name" "review" {
  domain_name              = data.aws_acm_certificate.api_review.domain
  regional_certificate_arn = data.aws_acm_certificate.api_review.arn
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

data "aws_iam_policy_document" "api_gateway_policy" {
  statement {
    actions   = ["execute-api:Invoke"]
    resources = ["execute-api:/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_api_gateway_rest_api_policy" "review" {
  rest_api_id = aws_api_gateway_rest_api.review.id
  policy      = data.aws_iam_policy_document.api_gateway_policy.json
}

data "aws_iam_policy_document" "redirect_service_lambda" {
  statement {
    sid       = "kmsDecrypt"
    actions   = ["kms:Decrypt", "kms:DescribeKey"]
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

data "aws_api_gateway_api_key" "web" {
  id = "wvxsivdxwk"
}

data "aws_api_gateway_api_key" "aux" {
  id = "dey7siocwj"
}
