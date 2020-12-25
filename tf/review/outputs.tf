output "web_target_bucket_name" {
  value = aws_s3_bucket.review.id
}

output "web_cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.review.id
}
