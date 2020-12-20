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
  config = {
    bucket = "meandering-rocks-configuration"
    key    = "terraform/common/.tfstate"
    region = "us-east-1"
  }
}

locals {
  target_address = "https://dev.meandering.rocks"
}
