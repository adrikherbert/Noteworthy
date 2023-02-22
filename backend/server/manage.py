import click
from flask.cli import with_appcontext


@click.command("init")
@with_appcontext
def init():
    """Create a new root user"""
    from server.extensions import db
    from server.models import UserAccount

    click.echo("create user")
    user = UserAccount(username="root", email="root@root.com", password="fe46cd5f3f389afc5b0f984177b42276", active=True)
    db.session.add(user)
    db.session.commit()
    click.echo("created user root")
