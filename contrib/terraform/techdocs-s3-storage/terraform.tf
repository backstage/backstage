#==========================
# Variables
#==========================

variable "backstage-bucket" {
  default = "backstage_bucket_for_my_corp"
}

variable "backstage-iam" {
  default = "backstage"
}

variable "shared-managed-tag-value" {
  default = "terraform_for_my_corp"
}

#==========================
# Bucket
#==========================

resource "aws_s3_bucket" "backstage" {
  bucket = var.backstage-bucket
  acl    = "private"
  provider = aws

  lifecycle {
    prevent_destroy = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
  }

  tags = {
    Name                   = var.backstage-bucket
    "Managed By Terraform" = var.shared-managed-tag-value
  }
}

resource "aws_s3_bucket_public_access_block" "backstage" {
  bucket = aws_s3_bucket.backstage.id

  block_public_acls   = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}


#==========================
# IAM
#==========================

resource "aws_iam_user" "backstage" {
  name = var.backstage-iam
}

resource "aws_iam_user_policy" "backstage" {
  name = var.backstage-iam
  user = aws_iam_user.backstage.name
  policy = data.aws_iam_policy_document.backstage-policy.json
}

data "aws_iam_policy_document" "backstage-policy" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket"
    ]
    effect = "Allow"
    resources = [
      "${aws_s3_bucket.backstage.arn}",
      "${aws_s3_bucket.backstage.arn}/*",
    ]
  }
}
