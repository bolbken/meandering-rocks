
resource "aws_lambda_layer_version" "sharp" {
  layer_name          = "sharp-layer"
  filename            = "../../api/layers/sharp-layer/nodejs.zip"
  compatible_runtimes = ["nodejs12.x"]
}

resource "aws_kms_key" "api" {
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
    resources = [aws_kms_key.api.arn]
  }

  statement {
    sid       = "googleOaths3Token"
    actions   = ["*"]
    resources = [aws_s3_bucket.configuration.arn]
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
    resources = [aws_kms_key.api.arn]
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
