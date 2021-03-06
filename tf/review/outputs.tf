output "web_target_bucket_name" {
  value = aws_s3_bucket.review.id
}

output "web_cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.review.id
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.review.id
}

output "api_gateway_resource_id" {
  value = aws_api_gateway_rest_api.review.root_resource_id
}

output "api_domain" {
  value = data.aws_acm_certificate.api_review.domain
}

output "api_key_web" {
  value = data.aws_api_gateway_api_key.web.value
}
