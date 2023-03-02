"""Various helpers for auth. Mainly about tokens blocklisting

Heavily inspired by
https://github.com/vimalloc/flask-jwt-extended/blob/master/examples/blocklist_database.py
"""
from datetime import datetime

from flask_jwt_extended import decode_token
from flask_mail import Message
from sqlalchemy.orm.exc import NoResultFound

from server.extensions import db, mail
from server.models import TokenBlocklist


def add_token_to_database(encoded_token, identity_claim):
    """
    Adds a new token to the database. It is not revoked when it is added.

    :param identity_claim: configured key to get user identity
    """
    decoded_token = decode_token(encoded_token)
    jti = decoded_token["jti"]
    token_type = decoded_token["type"]
    user_identity = decoded_token[identity_claim]
    expires = datetime.fromtimestamp(decoded_token["exp"])
    revoked = False

    db_token = TokenBlocklist(
        jti=jti,
        token_type=token_type,
        user_id=user_identity,
        expires=expires,
        revoked=revoked,
    )
    db.session.add(db_token)
    db.session.commit()


def is_token_revoked(jwt_payload):
    """
    Checks if the given token is revoked or not. Because we are adding all the
    tokens that we create into this database, if the token is not present
    in the database we are going to consider it revoked, as we don't know where
    it was created.
    """
    jti = jwt_payload["jti"]
    try:
        token = TokenBlocklist.query.filter_by(jti=jti).one()
        return token.revoked
    except NoResultFound:
        return True


def revoke_token(token_jti, user):
    """Revokes the given token

    Since we use it only on logout that already require a valid access token,
    if token is not found we raise an exception
    """
    try:
        token = TokenBlocklist.query.filter_by(jti=token_jti, user_id=user).one()
        token.revoked = True
        db.session.commit()
    except NoResultFound:
        raise Exception("Could not find the token {}".format(token_jti))


def change_pass(user, new_pass):
    """Change the password of the given user

    :param user: UserAccount instance
    :param new_pass: new password
    """
    user.password = new_pass
    db.session.commit()


def set_temp_pass(user, temp_pass):
    """Set the temporary password of the given user, email them said password, and revoke their JWT: forced relogin

    :param user: UserAccount instance
    :param temp_pass: temporary password
    """
    user.password = temp_pass
    db.session.commit()

    msg = Message(
        "Noteworthy Password Reset",
        recipients=[user.email]
    )

    msg.body = "You have been sent a temporary password. Please use this temporary password to login and change your password: {}".format(temp_pass)

    mail.send(msg)

    