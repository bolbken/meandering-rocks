
resource "aws_s3_bucket" "artifacts" {
  bucket = "meandering-rocks-artifacts"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    project   = "meandering.rocks"
    component = "build"
  }
}


