"""Default configuration

Use env var to override
"""
import os
from datetime import timedelta

DEBUG = os.environ.get("FLASK_DEBUG")
ENV = "development" if DEBUG == "1" else "production"

if DEBUG:
    # SSH into EC2 instance
    EC2_URI = os.environ.get("EC2_URI")
    SSH_USERNAME = os.environ.get("SSH_USERNAME")
    SSH_PKEY = os.path.abspath(os.environ.get("SSH_PKEY"))
    SSH_PORT = os.environ.get("SSH_PORT")

    # Access database via EC2 instance
    DIRECT_DATABASE_URI = os.environ.get("DIRECT_DATABASE_URI")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SSH_SQLALCHEMY_DATABASE_URI")
else:
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")

DATABASE_PORT = os.environ.get("DATABASE_PORT")

# JWT
JWT_SECRET_KEY = SECRET_KEY = os.environ.get("SECRET_KEY")
JWT_TOKEN_LOCATION = ["cookies"]
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)


CORS_HEADERS='Content-Type'

SQLALCHEMY_TRACK_MODIFICATIONS = False
