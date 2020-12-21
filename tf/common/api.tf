
resource "aws_api_gateway_rest_api" "common" {
  api_key_source = "HEADER"
  name           = "meandering-rocks-api-gateway"

  tags = {
    project     = "meandering.rocks"
    environment = "common"
    component   = "api"
  }
}

resource "aws_api_gateway_rest_api_policy" "common" {
  rest_api_id = aws_api_gateway_rest_api.common.id
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "execute-api:Invoke",
      "Resource": "${aws_api_gateway_rest_api.common.arn}"
    }
  ]
}
EOF
}

resource "aws_lambda_layer_version" "sharp" {
  layer_name          = "sharp-layer"
  filename            = "../../api/layers/sharp-layer/nodejs.zip"
  compatible_runtimes = ["nodejs12.x"]
}




resource "aws_kms_key" "common" {
  description = "The meandering rocks api encrypt and decrypt key."
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

data "aws_iam_policy_document" "photos_service_lambda" {
  statement {
    sid       = "sharpLayer"
    actions   = ["lambda:GetLayerVersion"]
    resources = [aws_lambda_layer_version.sharp.arn]
  }

  statement {
    sid       = "kmsDecrypt"
    actions   = ["kms:Decrypt"]
    resources = [aws_kms_key.common.arn]
  }

  statement {
    sid = "googleOaths3Token"
    actions = [
      "s3:ReplicateObject",
      "s3:PutObject",
      "s3:RestoreObject",
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:GetObjectVersion"
    ]
    resources = ["${data.aws_s3_bucket.configuration.arn}/api/*"]
  }
}

resource "aws_iam_role" "photos_service_lambda" {
  name               = "meandering-rocks-api-photos-service-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_role.json
}

resource "aws_iam_role_policy" "photos_service_lambda" {
  name   = "meandering-rocks-api-photos-service-lambda-execution-policy"
  role   = aws_iam_role.photos_service_lambda.id
  policy = data.aws_iam_policy_document.photos_service_lambda.json
}

data "aws_iam_policy_document" "newsletter_service_lambda" {
  statement {
    sid       = "kmsDecrypt"
    actions   = ["kms:Decrypt"]
    resources = [aws_kms_key.common.arn]
  }
}

resource "aws_iam_role" "newsletter_service_lambda" {
  name               = "meandering-rocks-api-newsletter-service-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_role.json
}

resource "aws_iam_role_policy" "newsletter_service_lambda" {
  name   = "meandering-rocks-api-newsletter-service-lambda-execution-policy"
  role   = aws_iam_role.newsletter_service_lambda.id
  policy = data.aws_iam_policy_document.newsletter_service_lambda.json
}
