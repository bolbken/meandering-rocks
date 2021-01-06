
resource "aws_iam_user" "github_actions_ci" {
  name = "MeanderingRocksGithubActionsCI"

  tags = {
    "project"     = "meandering.rocks"
    "environment" = "common"
    "component"   = "ci"
  }
}

data "aws_iam_policy_document" "github_actions_ci" {
  statement {
    sid = "assumeCodebuildRoleReview"
    actions = [
      "sts:AssumeRole",
      "sts:TagSession"
    ]
    resources = [aws_iam_role.codebuild.arn]
  }
}

resource "aws_iam_user_policy" "github_actions_ci" {
  name   = "meandering-rocks-github-actions-ci"
  user   = aws_iam_user.github_actions_ci.name
  policy = data.aws_iam_policy_document.github_actions_ci.json
}
