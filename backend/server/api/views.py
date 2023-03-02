from flask import Blueprint, current_app, jsonify, request
from flask_restful import Api
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from marshmallow import ValidationError
from server.extensions import apispec
# from server.extensions import db
# from server.models import UserAccount
from server.api.resources import *
from server.api.schemas import UserAccountSchema, NoteSchema, CollectionSchema, LocationSchema


blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(blueprint)


api.add_resource(UserAccountResource, "/users/<int:user_id>", endpoint="user_by_id")
api.add_resource(UserAccountList, "/users", endpoint="users")
api.add_resource(NoteResource, "/notes/<int:note_id>", endpoint="note_by_id")
api.add_resource(NoteList, "/notes", endpoint="notes")
api.add_resource(NoteByPage, "/page", endpoint="note_by_page")
api.add_resource(CollectionResource, "/collections/<int:collection_id>", endpoint="collection_by_id")
api.add_resource(CollectionList, "/collections", endpoint="collections")


@blueprint.before_app_first_request
def register_views():
    apispec.spec.components.schema("UserAccountSchema", schema=UserAccountSchema)
    apispec.spec.components.schema("NoteSchema", schema=NoteSchema)
    apispec.spec.components.schema("CollectionSchema", schema=CollectionSchema)
    apispec.spec.components.schema("LocationSchema", schema=LocationSchema)
    apispec.spec.path(view=UserAccountResource, app=current_app)
    apispec.spec.path(view=UserAccountList, app=current_app)
    apispec.spec.path(view=NoteResource, app=current_app)
    apispec.spec.path(view=NoteList, app=current_app)
    apispec.spec.path(view=NoteByPage, app=current_app)
    apispec.spec.path(view=CollectionResource, app=current_app)
    apispec.spec.path(view=CollectionList, app=current_app)


# @blueprint.before_request
# @jwt_required
# def block_touch_other_users():
#     if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
#         user_id = get_jwt_identity()
#         if request.json.get("user_id", None) and request.json["user_id"] != user_id:
#             return jsonify({"msg": "You cannot touch other users"}), 403


@blueprint.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    """Return json error for marshmallow validation errors.

    This will avoid having to try/catch ValidationErrors in all endpoints, returning
    correct JSON response with associated HTTP 400 Status (https://tools.ietf.org/html/rfc7231#section-6.5.1)
    """
    return jsonify(e.messages), 400
