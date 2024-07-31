resource "aws_vpc" "main_vpc" {
  cidr_block = var.main_vpc_cidr_block

  tags = {
    "Name" = "main-vpc"
  }
}

resource "aws_subnet" "apps_vms_subnet" {
  vpc_id     = aws_vpc.main_vpc.id
  cidr_block = var.apps_vms_subnet_cidr_block

  tags = {
    "Name" = "apps-vms-subnet"
  }
}
