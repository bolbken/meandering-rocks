output "photos_service_lambda_role_arn" {
  value = aws_iam_role.photos_service_lambda.arn
}

output "newsletter_service_lambda_role_arn" {
  value = aws_iam_role.newsletter_service_lambda.arn
}

output "kms_arn" {
  value = aws_kms_key.common.arn
}

output "lambda_layer_sharp" {
  value = aws_lambda_layer_version.sharp.arn
}
