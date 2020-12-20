terraform {
  backend "s3" {
    bucket = "meandering-rocks-configuration"
    key    = "terraform/common/.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_api_gateway_rest_api" "prod" {
  api_key_source = "HEADER"
  name           = "meandering-rocks-api-gateway"

  tags = {
    project     = "meandering.rocks"
    environment = "common"
    component   = "api"
  }
}
