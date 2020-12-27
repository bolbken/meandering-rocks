output "web_target_bucket_name" {
  value = aws_s3_bucket.production.id
}

output "web_bucket_s3_website_endpoint" {
  value = aws_s3_bucket.production.website_endpoint
}

output "web_cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.production.id
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.production.id
}

output "api_gateway_resource_id" {
  value = aws_api_gateway_rest_api.production.root_resource_id
}
