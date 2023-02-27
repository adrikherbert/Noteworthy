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

    
    def delete(self, note_id):
        # delete a note
        note = Note.query.get_or_404(note_id)
        db.session.delete(note)
        db.session.commit()

        return {"msg": "note deleted"}
    

class NoteList(Resource):
    """Note creation and get_all
    ---
    """

    method_decorators = [jwt_required()]

    
    def get(self):
        """
        Edit to query for all notes from a specific user / resource
        *** Currently queries for all notes

        idea: /notes/<string:resource>/<int:resource_id>
        """
        schema = NoteSchema(many=True)
        user_id = request.json['user_id']
        print(user_id)

        query = Note.query.filter_by(user_id=user_id)

        return paginate(query, schema)
    

    def post(self):
        schema = NoteSchema()
        note = schema.load(request.json)

        db.session.add(note)
        db.session.commit()

        return {"msg": "note created", "note": schema.dump(note)}, 201
