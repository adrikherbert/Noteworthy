from flask import Blueprint, current_app, jsonify, request
from flask_restful import Api
from marshmallow import ValidationError
from server.extensions import apispec
from server.extensions import db
# from server.models import UserAccount
from server.api.resources import UserAccountResource, UserAccountList
from server.api.schemas import UserAccountSchema


blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(blueprint)


api.add_resource(UserAccountResource, "/users/<int:user_id>", endpoint="user_by_id")
api.add_resource(UserAccountList, "/users", endpoint="users")


@blueprint.before_app_first_request
def register_views():
    apispec.spec.components.schema("UserAccountSchema", schema=UserAccountSchema)
    apispec.spec.path(view=UserAccountResource, app=current_app)
    apispec.spec.path(view=UserAccountList, app=current_app)


@blueprint.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    """Return json error for marshmallow validation errors.

    This will avoid having to try/catch ValidationErrors in all endpoints, returning
    correct JSON response with associated HTTP 400 Status (https://tools.ietf.org/html/rfc7231#section-6.5.1)
    """
    return jsonify(e.messages), 400

# Useless: see 'post' function of UserAccountList class in resources/user.py
# @blueprint.route("/users/add", methods=["POST"])
# def addUser():
#     if not request.is_json:
#         return jsonify({"msg": "Missing JSON in request"}), 400

#     username = request.json.get("username", None)
#     password = request.json.get("password", None)

#     user = UserAccount(username=username, email="example@gmail.com", password=password, active=True)
#     db.session.add(user)
#     db.session.commit()

#     if not username or not password:
#         return jsonify({"msg": "Missing username or password"}), 400

#     return jsonify({"Message": "Username and Password received"}), 200