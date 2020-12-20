terraform {
  backend "s3" {
    bucket = "meandering-rocks-configuration"
    key    = "terraform/review/.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

data "terraform_remote_state" "common" {
  backend = "s3"
  config {
    bucket = "meandering-rocks-configuration"
    key    = "terraform/common/.tfstate"
    region = "us-east-1"
  }
}

locals {
  domain_name = "api.dev.meandering.rocks"
}

resource "aws_api_gateway_stage" "review" {
  stage_name    = "review"
  rest_api_id   = terraform_remote_state.common.aws_api_gateway_rest_api.common.id
  deployment_id = aws_api_gateway_deployment.review.id
}

resource "aws_api_gateway_deployment" "review" {
  rest_api_id = terraform_remote_state.common.aws_api_gateway_rest_api.common.id
}

resource "aws_api_gateway_domain_name" "review" {
  domain_name              = locals.domain_name
  regional_certificate_arn = "arn:aws:acm:us-east-1:310674449483:certificate/0e6ca20b-9e39-4fde-9289-0785248bdf9e"
  security_policy          = "TLS_1_2"

  endpoint_configuration {
    types = [
      "REGIONAL",
    ]
  }

  tags = {
    "environment" = "review"
    "project"     = "meandering.rocks"
    "component"   = "api"
  }
}

resource "aws_api_gateway_base_path_mapping" "review" {
  api_id      = terraform_remote_state.common.aws_api_gateway_rest_api.common.id
  domain_name = locals.domain_name
  id          = "${locals.domain_name}/"
  stage_name  = aws_api_gateway_stage.review.stage_name
}

