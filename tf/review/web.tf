resource "aws_cloudfront_origin_access_identity" "review" {
  comment = "meandering-rocks-site-review-origin-access-id"
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

data "aws_iam_policy_document" "review_site_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.review.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.review.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "review" {
  bucket = aws_s3_bucket.review.id
  policy = data.aws_iam_policy_document.review_site_policy.json
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
    origin_id   = "S3-Website-${aws_s3_bucket.review.bucket_regional_domain_name}"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.review.cloudfront_access_identity_path
    }
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
    acm_certificate_arn = "arn:aws:acm:us-east-1:310674449483:certificate/f64af084-6b6f-49f9-87bd-7282d2eed99e"
    ssl_support_method  = "sni-only"
  }

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "web"
  }
}

data "aws_iam_policy_document" "redirect_lambda" {
  statement {
    sid     = "awsServiceLambdaEdgeLambda"
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "redirect_lambda" {
  name               = "meandering_rocks_web_redirect_lambda"
  assume_role_policy = data.aws_iam_policy_document.redirect_lambda.json

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "web"
  }
}

# data "aws_iam_policy_document" "lambda_edge" {
#   statement {
#     sid       = "getLambdaFunction"
#     actions   = ["lambda:GetFunction"]
#     resources = [aws_lambda_function.review_auth_redirect.qualified_arn]
#   }

#   statement {
#     sid     = "reviewSiteS3Bucket"
#     actions = ["s3:*"]
#     resources = [
#       aws_s3_bucket.review.arn,
#       "${aws_s3_bucket.review.arn}/*"
#     ]
#   }
# }

# resource "aws_iam_policy" "lambda_edge" {
#   name   = "meandering-rocks-web-redirect-service-lambda-edge-policy"
#   policy = data.aws_iam_policy_document.lambda_edge.json
# }

# resource "aws_iam_role_policy_attachment" "lambda_edge" {
#   role       = aws_iam_role.redirect_lambda.id
#   policy_arn = aws_iam_policy.lambda_edge.arn
# }

resource "aws_lambda_function" "review_auth_redirect" {
  filename      = "../../services/redirect/.serverless/redirect.zip"
  function_name = "meandering-rocks-web-redirect-lambda"
  role          = aws_iam_role.redirect_lambda.arn
  handler       = "handler.redirect"
  timeout       = 10
  runtime       = "nodejs12.x"
  publish       = true

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("../../services/redirect/.serverless/redirect.zip")

  tags = {
    project     = "meandering.rocks"
    environment = "review"
    component   = "web"
  }
}
