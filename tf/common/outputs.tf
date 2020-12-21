output "api_gateway_id" {
  value = aws_api_gateway_rest_api.common.id
}

output "api_gateway_resource_id" {
  value = aws_api_gateway_rest_api.common.root_resource_id
}

output "photos_service_lambda_role_arn" {
  value = aws_iam_role.photos_service_lambda.arn
}

output "newsletter_service_lambda_role_arn" {
  value = aws_iam_role.newsletter_service_lambda.arn
}

output "kms_arn" {
    value = aws_kms_key.common.arn
}