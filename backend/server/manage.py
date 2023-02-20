import click
from flask.cli import with_appcontext


@click.command("init")
@with_appcontext
def init():
    """Create a new admin user"""
    from server.extensions import db
    from server.models import User

    click.echo("create user")
    user = User(username="admin", email="adrikbh@gmail.com", password="fe46cd5f3f389afc5b0f984177b42276", active=True)
    db.session.add(user)
    db.session.commit()
    click.echo("created user admin")
