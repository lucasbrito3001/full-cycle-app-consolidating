resource "aws_instance" "webapps_vms" {
  count         = var.webapps_vms_replicas
  ami           = var.ubuntu_2404_ami
  instance_type = var.instance_type

  tags = {
    Name = "webapps-vm${count.index}"
  }
  
  subnet_id = aws_subnet.apps_vms_subnet.id

  security_groups = []
}
