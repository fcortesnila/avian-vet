# AWS deployment starter

This folder is a deployment design stub, not a deployable production stack yet. The intended target is ECS/Fargate with separate API and web services, an RDS MariaDB database in private subnets, an ECR image registry, Secrets Manager, HTTPS ingress, and CloudWatch logs/alarms.

Before applying infrastructure, add reviewed VPC/subnet/security-group modules, TLS/domain, remote encrypted Terraform state, IAM least privilege, image build/push, secret injection, database backups/restore, migrations, and cost controls. The API currently has no authentication, so do not expose it to real users or real patient data.
