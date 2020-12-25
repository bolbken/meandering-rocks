variable "service_redirect_auth_credentials" {
  type        = string
  description = "Map of key/value pairs that specify authorized username/password combinations respectively."
}

variable "target_address" {
  type    = string
  default = "https://dev.meandering.rocks"
}
