from flask import Blueprint, current_app, jsonify, request
from flask_restful import Api
from marshmallow import ValidationError
from server.extensions import apispec
from server.extensions import db
from server.models import User
from server.api.resources import UserResource, UserList
from server.api.schemas import UserSchema


blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(blueprint)


api.add_resource(UserResource, "/users/<int:user_id>", endpoint="user_by_id")
api.add_resource(UserList, "/users", endpoint="users")


@blueprint.before_app_first_request
def register_views():
    apispec.spec.components.schema("UserSchema", schema=UserSchema)
    apispec.spec.path(view=UserResource, app=current_app)
    apispec.spec.path(view=UserList, app=current_app)


@blueprint.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    """Return json error for marshmallow validation errors.

    This will avoid having to try/catch ValidationErrors in all endpoints, returning
    correct JSON response with associated HTTP 400 Status (https://tools.ietf.org/html/rfc7231#section-6.5.1)
    """
    return jsonify(e.messages), 400

# Useless: see 'post' function of UserList class in resources/user.py
# @blueprint.route("/users/add", methods=["POST"])
# def addUser():
#     if not request.is_json:
#         return jsonify({"msg": "Missing JSON in request"}), 400

#     username = request.json.get("username", None)
#     password = request.json.get("password", None)

#     user = User(username=username, email="example@gmail.com", password=password, active=True)
#     db.session.add(user)
#     db.session.commit()

#     if not username or not password:
#         return jsonify({"msg": "Missing username or password"}), 400

#     return jsonify({"Message": "Username and Password received"}), 200