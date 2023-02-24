"""Default configuration

Use env var to override
"""
import os

DEBUG = os.environ.get("FLASK_DEBUG")
ENV = "development" if DEBUG == "1" else "production"

if DEBUG:
    EC2_URI = os.environ.get("EC2_URI")
    SSH_USERNAME = os.environ.get("SSH_USERNAME")
    SSH_PKEY = os.path.abspath(os.environ.get("SSH_PKEY"))
    SSH_PORT = os.environ.get("SSH_PORT")
    DIRECT_DATABASE_URI = os.environ.get("DIRECT_DATABASE_URI")
    DATABASE_PORT = os.environ.get("DATABASE_PORT")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SSH_SQLALCHEMY_DATABASE_URI")
else:
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")

DATABASE_PORT = os.environ.get("DATABASE_PORT")
SECRET_KEY = os.environ.get("SECRET_KEY")

CORS_HEADERS='Content-Type'

SQLALCHEMY_TRACK_MODIFICATIONS = False
