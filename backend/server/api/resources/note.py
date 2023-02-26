from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from server.api.schemas import NoteSchema
from server.models import Note
from server.extensions import db
from server.commons.pagination import paginate


class NoteResource(Resource):
    """Setting and retrieving note resources
    ---
    """

    method_decorators = [jwt_required()]

    def get(self, note_id):
        # get note
        schema = NoteSchema()
        note = Note.query.get_or_404(note_id)
        return {"note": schema.dump(note)}

    
    def put(self, note_id):
        # update a note
        schema = NoteSchema(partial=True)
        note = Note.query.get_or_404(note_id)
        note = schema.load(request.json, instance=note)

        db.session.commit()

        return {"msg": "note updated", "note": schema.dump(note)}

    """
    def delete(self, user_id):
        # delete a note
        return
    """

class NoteList(Resource):
    """Note creation and get_all
    ---
    """

    method_decorators = [jwt_required()]

    """
    def get(self):
        # get all notes / from user / from resource
        return
    """

    def post(self):
        schema = NoteSchema()
        note = schema.load(request.json)

        db.session.add(note)
        db.session.commit()

        return {"msg": "note created", "note": schema.dump(note)}, 201
