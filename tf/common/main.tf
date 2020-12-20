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

data "aws_s3_bucket" "configuration" {
  bucket = "meandering-rocks-configuration"
}
