provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "Travel" {
  name         = "Travel"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "TripsTable"
  }
}