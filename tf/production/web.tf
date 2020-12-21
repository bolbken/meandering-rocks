resource "aws_s3_bucket" "production" {
  bucket = "meandering-rocks-site-production"
  acl    = "public-read"

  versioning {
    enabled = true
  }

  website {
    error_document = "404.html"
    index_document = "index.html"
  }

  tags = {
    project     = "meandering.rocks"
    environment = "production"
    component   = "web"
  }
}

resource "aws_s3_bucket_policy" "production" {
  bucket = aws_s3_bucket.production.id
  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "${aws_s3_bucket.production.arn}/*"
        }
    ]
}
POLICY
}

resource "aws_cloudfront_distribution" "production" {

  aliases = [
    "meandering.rocks",
    "www.meandering.rocks",
  ]
  comment             = "Production meandering.rocks website."
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = true

  origin {
    domain_name = aws_s3_bucket.production.bucket_regional_domain_name
    origin_id   = "S3-Website-${aws_s3_bucket.production.bucket_regional_domain_name}"
  }

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 403
    response_code         = 404
    response_page_path    = "/404.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Website-${aws_s3_bucket.production.bucket_regional_domain_name}"

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
  }

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:310674449483:certificate/9d4fa27e-4778-4006-96d0-3eb0f3ce3b9b"
    ssl_support_method  = "sni-only"
  }

  tags = {
    project     = "meandering.rocks"
    environment = "production"
    component   = "web"
  }
}
