variable "api_gateway_id" {
  type = string
  description = "The parent api gateway's id for which the stage is created."
}

variable "api_gateway_stage_name" {
  type = string
  description = "The desired name for the api gateway stage."
}