
resource "aws_iam_user" "github_actions_cicd" {
  name = "MeanderingRocksGithubActionsCICD"

  tags = {
    "project"     = "meandering.rocks"
    "environment" = "common"
    "component"   = "ci"
  }
}

data "aws_iam_policy_document" "github_actions_cicd" {
  statement {
    sid = "value"
    actions = [
      "s3:GetObject",
      "s3:GetObjectVersion"
    ]
    resources = ["${aws_s3_bucket.configuration.arn}/*"]
  }
}

resource "aws_iam_user_policy" "github_actions_cicd" {
  name   = "meandering-rocks-github-actions-cicd"
  user   = aws_iam_user.github_actions_cicd.name
  policy = data.aws_iam_policy_document.github_actions_cicd.json
}
