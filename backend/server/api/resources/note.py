from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from server.api.schemas import NoteSchema, LocationSchema
from server.models import Note
from server.extensions import db
from server.commons.pagination import paginate

"""
TODO: Constrain retrieval, deletion, and modification to owning users
"""

class NoteResource(Resource):
    """Retrieve and modify single notes

    ---
    get:
      tags:
        - api
      summary: Get a note
      description: Get a single note by ID
      parameters:
        - in: path
          name: note_id
          schema:
            type: integer
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  note: NoteSchema
        404:
          description: note does not exist
    put:
      tags:
        - api
      summary: Update a note
      description: Update a single note by ID
      parameters:
        - in: path
          name: note_id
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              NoteSchema
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: note updated
                  user: NoteSchema
        404:
          description: note does not exist
    delete:
      tags:
        - api
      summary: Delete a note
      description: Delete a single note by ID
      parameters:
        - in: path
          name: note_id
          schema:
            type: integer
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: note deleted
        404:
          description: note does not exist
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
    """Creation and get_all

    ---
    get:
      tags:
        - api
      summary: Get a list of notes
      description: Get a list of paginated notes
      responses:
        200:
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginatedResult'
                  - type: object
                    properties:
                      results:
                        type: array
                        items:
                          $ref: '#/components/schemas/NoteSchema'
    post:
      tags:
        - api
      summary: Create a note
      description: Create a new note
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                note:
                  type: object
                  properties:
                    user_id:
                      type: integer
                      example: 1
                    collection_id:
                      type: integer
                      example: 1
                    access_type:
                      type: integer
                      example: 0
                    content:
                      type: string
                      example: example content
                    title:
                      type: string
                      example: example title
                    comments:
                      type: array
                      example: ["comment 1", "comment 2", "comment 3"]
                location:
                  type: object
                  properties:
                    url:
                      type: string
                      example: https://example.com
                    coords:
                      type: array
                      example: [0, 0]
      responses:
        201:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: note created
                  note: NoteSchema
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
        # Define Note and Location Schemas
        note_schema = NoteSchema()
        location_schema = LocationSchema()

        # Get note and location JSON from request
        note = request.json.get("note")
        location = request.json.get("location")

        # Load note into schema and commit
        note = note_schema.load(note)
        db.session.add(note)
        db.session.commit()

        # Get note_id from note.id in db, add to location
        note_id = note_schema.dump(note).get("id")
        location = request.json.get("location")
        location["note_id"] = note_id
        location = location_schema.load(location)

        # Commit location with note_id to db
        db.session.add(location)
        db.session.commit()

        # Update note.location in db with location.id
        note_schema = NoteSchema(partial=True)
        location_id = location_schema.dump(location).get("id")
        location_id = {"location": location_id}
        note = note_schema.load(location_id, instance=note)

        # Commit db session
        db.session.commit()

        return {"msg": "note created", "note": note_schema.dump(note), "location": location_schema.dump(location)}, 201
