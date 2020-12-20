locals {
  domain_name = "api.meandering.rocks"
}

resource "aws_api_gateway_stage" "production" {
  stage_name    = "production"
  rest_api_id   = data.terraform_remote_state.common.aws_api_gateway_rest_api.common.id
  deployment_id = aws_api_gateway_deployment.production.id
}

resource "aws_api_gateway_deployment" "production" {
  rest_api_id = data.terraform_remote_state.common.aws_api_gateway_rest_api.common.id
}

resource "aws_api_gateway_domain_name" "production" {
  domain_name              = local.domain_name
  regional_certificate_arn = "arn:aws:acm:us-east-1:310674449483:certificate/35a84fa8-4ee7-4945-ac67-8a0266a75e4b"
  security_policy          = "TLS_1_2"

  endpoint_configuration {
    types = [
      "REGIONAL",
    ]
  }

  tags = {
    "environment" = "production"
    "project"     = "meandering.rocks"
    "component"   = "api"
  }
}

resource "aws_api_gateway_base_path_mapping" "production" {
  api_id      = data.terraform_remote_state.common.aws_api_gateway_rest_api.common.id
  domain_name = local.domain_name
  id          = "${local.domain_name}/"
  stage_name  = aws_api_gateway_stage.production.stage_name
}

