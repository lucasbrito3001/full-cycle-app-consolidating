variable "region" {
  type    = string
  default = "us-east-1"
}

variable "ubuntu_2404_ami" {
  type    = string
  default = "ami-0a0e5d9c7acc336f1"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "webapps_vms_replicas" {
  type    = number
  default = 2
}

variable "main_vpc_cidr_block" {
  type    = string
  default = "192.168.0.0/16"
}

variable "apps_vms_subnet_cidr_block" {
  type    = string
  default = "192.168.0.0/24"
}
