resource "aws_api_gateway_stage" "default" {
  stage_name    = var.api_gateway_stage_name
  rest_api_id   = var.api_gateway_id
  deployment_id = aws_api_gateway_deployment.default.id
}

resource "aws_api_gateway_deployment" "default" {
  rest_api_id = var.api_gateway_id
  stage_name  = var.api_gateway_stage_name
}