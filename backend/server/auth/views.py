from flask import request, jsonify, Blueprint, current_app as app
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from datetime import datetime, timezone, timedelta

from server.models import UserAccount
from server.extensions import pwd_context, jwt, apispec
from server.auth.helpers import revoke_token, is_token_revoked, add_token_to_database



# TODO: Store JWTs in httpOnly cookie
# https://blog.logrocket.com/jwt-authentication-best-practices/#tl-dr-what-are-they-good-for

blueprint = Blueprint("auth", __name__, url_prefix="/auth")

@blueprint.after_app_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


@blueprint.route("/login", methods=["POST"])
def login():
    """Authenticate user and return tokens

    ---
    post:
      tags:
        - auth
      summary: Authenticate a user
      description: Authenticates a user's credentials and returns tokens
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  example: myuser
                  required: true
                password:
                  type: string
                  example: P4$$w0rd!
                  required: true
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    example: myaccesstoken
                  refresh_token:
                    type: string
                    example: myrefreshtoken
        400:
          description: bad request
      security: []
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    user = UserAccount.query.filter_by(username=username).first()
    if user is None or not pwd_context.verify(password, user.password):
        return jsonify({"msg": "Bad credentials"}), 400

    access_token = create_access_token(identity=user.id)
    response = jsonify({"msg": "login successful"})
    set_access_cookies(response, access_token)
    add_token_to_database(access_token, app.config["JWT_IDENTITY_CLAIM"])
    
    return response, 200


@blueprint.route("/revoke_access", methods=["DELETE"])
@jwt_required()
def revoke_access_token():
    """Revoke an access token

    ---
    delete:
      tags:
        - auth
      summary: Revoke an access token
      description: Revoke an access token
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: token revoked
        400:
          description: bad request
        401:
          description: unauthorized
    """
    jti = get_jwt()["jti"]
    user_identity = get_jwt_identity()
    revoke_token(jti, user_identity)

    response = jsonify({"message": "token revoked"})
    unset_jwt_cookies(response)
    return response, 200


@jwt.user_lookup_loader
def user_loader_callback(jwt_headers, jwt_payload):
    identity = jwt_payload["sub"]
    return UserAccount.query.get(identity)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_headers, jwt_payload):
    return is_token_revoked(jwt_payload)


@blueprint.before_app_first_request
def register_views():
    apispec.spec.path(view=login, app=app)
    apispec.spec.path(view=refresh, app=app)
    apispec.spec.path(view=revoke_access_token, app=app)
