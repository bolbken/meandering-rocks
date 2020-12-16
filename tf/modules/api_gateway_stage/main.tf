resource "aws_api_gateway_stage" "" {
  stage_name    = "production"
  rest_api_id   = aws_api_gateway_rest_api.test.id
}