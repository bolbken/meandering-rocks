# locals {
#   domain_name = "api.meandering.rocks"
# }

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
  rest_api_id = aws_api_gateway_rest_api.prodcution.id
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

# resource "aws_api_gateway_domain_name" "production" {
#   domain_name              = local.domain_name
#   regional_certificate_arn = "arn:aws:acm:us-east-1:310674449483:certificate/35a84fa8-4ee7-4945-ac67-8a0266a75e4b"
#   security_policy          = "TLS_1_2"

#   endpoint_configuration {
#     types = [
#       "REGIONAL",
#     ]
#   }

#   tags = {
#     "environment" = "production"
#     "project"     = "meandering.rocks"
#     "component"   = "api"
#   }
# }

# resource "aws_api_gateway_base_path_mapping" "production" {
#   api_id      = data.terraform_remote_state.common.outputs.api_gateway_id
#   domain_name = local.domain_name
#   stage_name  = "production"
# }

