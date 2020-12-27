data "aws_acm_certificate" "api_production" {
  domain   = var.api_domain
  statuses = ["ISSUED"]
}

resource "aws_api_gateway_rest_api" "production" {
  api_key_source = "HEADER"
  name           = "meandering-rocks-api-gateway-production"

  tags = {
    project     = "meandering.rocks"
    environment = "production"
    component   = "api"
  }
}

resource "aws_api_gateway_rest_api_policy" "production" {
  rest_api_id = aws_api_gateway_rest_api.production.id
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "execute-api:Invoke",
      "Resource": "${aws_api_gateway_rest_api.production.arn}"
    }
  ]
}
EOF
}

resource "aws_api_gateway_domain_name" "production" {
  domain_name              = data.aws_acm_certificate.api_production.domain
  regional_certificate_arn = data.aws_acm_certificate.api_production.arn
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

data "aws_api_gateway_api_key" "web" {
  id = "2p5vgkodcf"
}

data "aws_api_gateway_api_key" "aux" {
  id = "ukk9yc1jtl"
}
