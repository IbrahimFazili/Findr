provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "us-east-1"
}

data "aws_availability_zones" "all" {}

resource "aws_launch_configuration" "find_dev_backend_config" {
  image_id = "ami-0b69ea66ff7391e80"
  instance_type = "t2.micro"
  security_groups = ["findr_dev_server_rules"]
  depends_on = ["aws_security_group.findr_dev_server_rules"]

  user_data = <<-EOF
              #!/bin/bash
              mkdir /home/backend
              curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
              export NVM_DIR="$HOME/.nvm"
              [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
              nvm install 10.15.3
              cd /home/backend
              aws configure set aws_access_key_id "${var.access_key}"
              aws configure set aws_secret_access_key "${var.secret_key}"
              aws configure set default_region_name "us-east-1"
              aws s3 cp s3://findr-user-media/.env ./.env
              git clone https://github.com/Lakshya2610/Findr.git
              cd Findr/backend
              npm i
              sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
              NODE_ENV=production node index.js
              EOF
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "findr_dev_autoscaler" {

  launch_configuration = "${aws_launch_configuration.find_dev_backend_config.id}"
  availability_zones = ["${data.aws_availability_zones.all.names}"]

  min_size = 1
  max_size = 3

  load_balancers = ["${aws_lb.findr-dev-alb.name}"]
  health_check_type = "ELB"

  tag {
    key = "Name"
    value = "findr-dev-backend"
    propagate_at_launch = true
  }
}

resource "aws_lb" "findr-dev-alb" {
  name = "findr-dev-alb"
  internal = false
  load_balancer_type = "application"

  security_groups = ["${aws_security_group.findr_dev_server_rules.id}"]

  tags = {
    Enviroment = "development"
  }
}

resource "aws_lb_listener" "request_listener" {
  load_balancer_arn = "${aws_lb.findr-dev-alb.arn}"
  port = "80"
  protocol = "HTTP"

  default_action {
    type = "forward"
  }
}

resource "aws_lb_listener" "ssh_listener" {
  load_balancer_arn = "${aws_lb.findr-dev-alb.arn}"
  port = "22"
  protocol = "TCP"

  default_action {
    type = "forward"
  }
}

resource "aws_security_group" "findr_dev_server_rules" {
  name        = "findr_dev_server_rules"
  description = "Findr backend server network rules for development enviroment"
  vpc_id      = "${aws_default_vpc.default.id}"

  ingress {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}
