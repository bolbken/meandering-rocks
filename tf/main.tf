terraform {
  backend "s3" {
    bucket = "meandering-rocks-configuration"
    key    = "terraform/.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# Shared CI/CD resources

resource "aws_s3_bucket" "artifacts" {
  bucket = "meandering-rocks-artifacts"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    project = "meandering.rocks"
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
    project = "meandering.rocks"
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
    project = "meandering.rocks"
    environment = "build"
  }
}


# Common back-end API resources
resource "aws_api_gateway_rest_api" "default" {
  name = "MeanderingRocksAPIGateway"
  
}

# Production API resources
module "api_gateway_stage_production" {
  source = "./modules/api_gateway_stage"

  api_gateway_stage_name = "production"
  api_gateway_id = aws_api_gateway_rest_api.default.id
}


# Review stage API resources
module "api_gateway_stage_rerview" {
  source = "./modules/api_gateway_stage"

  api_gateway_stage_name = "review"
  api_gateway_id = aws_api_gateway_rest_api.default.id
}


# Production Web resources

resource "aws_s3_bucket" "production" {
  bucket = "meandering.rocks"
  acl    = "public-read"

  versioning {
    enabled = true
  }

  tags = {
    project = "meandering.rocks"
    environment = "production"
    component = "web"
  }
}

resource "aws_cloudfront_distribution" "production" {
  origin {
    domain_name = aws_s3_bucket.production.bucket_regional_domain_name
    origin_id   = "S3-Website-${aws_s3_bucket.production.bucket_regional_domain_name}/."
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Production meandering.rocks website."

  aliases = ["meandering.rocks", "www.meandering.rocks"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Website-${aws_s3_bucket.production.bucket_regional_domain_name}/."

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  price_class = "PriceClass_100"

  tags = {
    project = "meandering.rocks"
    environment = "production"
    component = "web"
  }

  viewer_certificate {
    iam_certificate_id = "9d4fa27e-4778-4006-96d0-3eb0f3ce3b9b"
  }
}

# Review Web Resources

resource "aws_s3_bucket" "review" {
  bucket = "dev.meandering.rocks"
  acl    = "private"

  tags = {
    project = "meandering.rocks"
    environment = "review"
    component = "web"
  }
}

resource "aws_iam_role" "redirect_lambda" {
  name = "meandering_rocks_web_redirect_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  tags = {
    project = "meandering.rocks"
    environment = "review"
    component = "web"
  }
}

resource "aws_lambda_function" "review_auth_redirect" {
  # arn:aws:lambda:us-east-1:310674449483:function:meandering-rocks-dev-s3-redirect-auth
  filename      = "../services/redirect/.serverless/redirect.zip"
  function_name = "meandering-rocks-web-redirect-lambda"
  role          = aws_iam_role.redirect_lambda.arn
  handler       = "handler.redirect"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("../services/redirect/.serverless/redirect.zip")

  runtime = "nodejs12.x"

  environment {
    variables = {
      SERVICE_REDIRECT_AUTH_CREDENTIALS = var.service_redirect_auth_credentials
    }
  }

  tags = {
    project = "meandering.rocks"
    environment = "review"
    component = "web"
  }
}

resource "aws_cloudfront_distribution" "review" {
  origin {
    domain_name = aws_s3_bucket.review.bucket_regional_domain_name
    origin_id   = "S3-Website-${aws_s3_bucket.review.bucket_regional_domain_name}/."
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Review dev.meandering.rocks website."

  aliases = ["dev.meandering.rocks", "dev.www.meandering.rocks"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Website-${aws_s3_bucket.review.bucket_regional_domain_name}/."

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = aws_lambda_function.review_auth_redirect.qualified_arn
      include_body = false
    }
  }

  price_class = "PriceClass_100"

  tags = {
    project = "meandering.rocks"
    environment = "review"
    component = "web"
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  viewer_certificate {
    iam_certificate_id = "f64af084-6b6f-49f9-87bd-7282d2eed99e"
  }
}