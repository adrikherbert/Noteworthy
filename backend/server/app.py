from flask import Flask

from sshtunnel import SSHTunnelForwarder
import signal
import os

from server import api
from server import auth
from server import manage
from server.extensions import apispec
from server.extensions import db
from server.extensions import jwt
from server.extensions import migrate


def create_app(testing=False):
    """Application factory, used to create application"""
    app = Flask("server")
    app.config.from_object("server.config")

    if testing is True:
        app.config["TESTING"] = True

    if app.config["DEBUG"]:
        if os.environ.get("LOCAL_PORT") is None:
            server = open_ssh_tunnel(app)
            server.start()

            local_port = str(server.local_bind_port)
            os.environ["LOCAL_PORT"] = local_port

            server.check_tunnels()
            print(f"Tunnel is Up {server.tunnel_is_up}")
            print('---------------TUNNEL IS ESTABLISHED----------------')


            def signal_handler(*_):
                print("Stopping ssh server.")
                server.stop()
                exit(0)

            signal.signal(signal.SIGINT, signal_handler)
            
        app.config["SQLALCHEMY_DATABASE_URI"] = app.config["SQLALCHEMY_DATABASE_URI"].format(os.environ["LOCAL_PORT"])

    configure_extensions(app)
    configure_cli(app)
    configure_apispec(app)
    register_blueprints(app)

    return app


def open_ssh_tunnel(app: Flask):
    server = SSHTunnelForwarder(
        (app.config["EC2_URI"], int(app.config["SSH_PORT"])),
        ssh_username=app.config["SSH_USERNAME"],
        ssh_pkey=app.config["SSH_PKEY"],
        remote_bind_address=(app.config["DIRECT_DATABASE_URI"], int(app.config["DATABASE_PORT"])),
    )

    return server


def configure_extensions(app: Flask):
    """Configure flask extensions"""
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)


def configure_cli(app: Flask):
    """Configure Flask 2.0's cli for easy entity management"""
    app.cli.add_command(manage.init)


def configure_apispec(app: Flask):
    """Configure APISpec for swagger support"""
    apispec.init_app(app, security=[{"jwt": []}])
    apispec.spec.components.security_scheme(
        "jwt", {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
    )
    apispec.spec.components.schema(
        "PaginatedResult",
        {
            "properties": {
                "total": {"type": "integer"},
                "pages": {"type": "integer"},
                "next": {"type": "string"},
                "prev": {"type": "string"},
            }
        },
    )


def register_blueprints(app: Flask):
    """Register all blueprints for application"""
    app.register_blueprint(auth.views.blueprint)
    app.register_blueprint(api.views.blueprint)
