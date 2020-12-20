terraform {
  backend "s3" {
    bucket = "meandering-rocks-configuration"
    key    = "terraform/review/.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "review" {
  bucket = "meandering-rocks-site-review"

  versioning {
    enabled = true
  }

  website {
    error_document = "404.html"
    index_document = "index.html"
  }

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "web"
  }
}

resource "aws_s3_bucket_policy" "review" {
  bucket = aws_s3_bucket.review.id
  policy = <<POLICY
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EHXV6VMM0JPFU"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::dev.meandering.rocks/*"
        }
    ]
}
POLICY
}

resource "aws_cloudfront_distribution" "review" {
  comment = "Review dev.meandering.rocks website."
  aliases = [
    "dev.meandering.rocks",
    "dev.www.meandering.rocks",
  ]
  default_root_object = "index.html"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"

  origin {
    domain_name = aws_s3_bucket.review.bucket_regional_domain_name
    origin_id   = "S3-Website-${aws_s3_bucket.review.bucket_regional_domain_name}/."
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Website-${aws_s3_bucket.review.bucket_regional_domain_name}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = aws_lambda_function.review_auth_redirect.qualified_arn
      include_body = false
    }
  }

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    iam_certificate_id = "f64af084-6b6f-49f9-87bd-7282d2eed99e"
  }

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "web"
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
    project     = "meandering.rocks"
    environment = "review"
    component   = "web"
  }
}

resource "aws_lambda_function" "review_auth_redirect" {
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
    project     = "meandering.rocks"
    environment = "review"
    component   = "web"
  }
}
