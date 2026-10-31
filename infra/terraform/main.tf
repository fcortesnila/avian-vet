terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = var.aws_region
}

# Intentionally no resources yet: networking, authentication, secrets, backups,
# and ingress require account-specific security review before provisioning.
