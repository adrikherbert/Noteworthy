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
from server.auth.helpers import revoke_token, is_token_revoked, add_token_to_database, change_pass, set_temp_pass


blueprint = Blueprint("auth", __name__, url_prefix="/auth")


# @blueprint.after_app_request
# def refresh_expiring_jwts(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             access_token = create_access_token(identity=get_jwt_identity())
#             set_access_cookies(response, access_token)
#         return response
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original response
#         return response


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
                email:
                  type: string
                  example: myuser@myuser.com
                  required: true
                password:
                  type: string
                  example: P4$$w0rd!
                  required: true
      responses:
        200:
          content:
            headers:
              Set-Cookie: access_token_cookie
              Set-Cookie: csrf_access_token
          description: login successful
        400:
          description: bad request
        452:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: bad email
        453:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: bad password
      security: []
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = UserAccount.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg": "Bad email"}), 452
    elif not pwd_context.verify(password, user.password):
        return jsonify({"msg": "Bad password"}), 453

    # access_token = create_access_token(identity=user.id)
    # response = jsonify({"msg": "login successful", "id": user.id, "access_token": access_token})
    # set_access_cookies(response, access_token)
    # add_token_to_database(access_token, app.config["JWT_IDENTITY_CLAIM"])
    
    return jsonify({"msg": "login successful", "id": user.id}), 200


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

    response = jsonify({"msg": "token revoked"})
    unset_jwt_cookies(response)
    return response, 200


@blueprint.route("/reset_password", methods=["POST"])
# @jwt_required()
def reset_password():
    """Reset a user's password

    ---
    post:
      tags:
        - auth
      summary: Reset a user's password to a temporary one.
      description: Reset a user's password to a temporary one.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
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
                  message:
                    type: string
                    example: password reset
        400:
          description: bad request
    """
    # user_id = get_jwt_identity()
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get("email", None)
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400
    
    user = UserAccount.query.filter_by(emai=email).first()
    if user is None:
        return jsonify({"msg": "The user cannot be found"}), 400
    
    password = request.json.get("password", None)
    if not password:
        return jsonify({"msg": "Missing password"}), 400
    change_pass(user, password)
    return jsonify({"msg": "password changed"}), 200        


@blueprint.route("/temp_password", methods=["POST"])
def temp_password():
    """Set a user's password to a temporary one.

    ---
    post:
    tags:
      - auth
    summary: Change a user's password
    description: Change a user's password
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              email:
                type: string
                example: myuser@myuser.com
                required: true
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: temporary password set
      400:
        description: bad request
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    email = request.json.get("email", None)
    if not email:
        return jsonify({"msg": "Missing email"}), 400
    
    user = UserAccount.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg": "Bad email"}), 452
    
    from secrets import token_urlsafe
    password = token_urlsafe(16)
    set_temp_pass(user, password)

    return jsonify({"msg": "temporary password set"}), 200


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
    apispec.spec.path(view=revoke_access_token, app=app)
