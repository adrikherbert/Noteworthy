from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.api.schemas import NoteSchema
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
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                resource:
                  type: string
                  example: title
                constraint:
                  type: any
                  example: example title
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
            schema: NoteSchema
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
        Query for a note list by resource
        """
        user_id = get_jwt_identity()

        schema = NoteSchema(many=True)
        query = 0

        if not request.json:
            query = Note.query
        else:
            resource = request.json['resource']

            if resource == 'id':
                constraint = request.json['constraint']
                query = Note.query.filter_by(id=constraint)
            elif resource == 'collection_id':
                constraint = request.json['constraint']
                query = Note.query.filter_by(collection_id=constraint)
            elif resource == 'user_id':
                constraint = request.json['constraint']
                query = Note.query.filter_by(user_id=constraint)
            elif resource == 'access_type':
                constraint = request.json['constraint']
                query = Note.query.filter_by(access_type=constraint)
            elif resource == 'content':
                constraint = request.json['constraint']
                query = Note.query.filter_by(content=constraint)
            elif resource == 'title':
                constraint = request.json['constraint']
                query = Note.query.filter_by(title=constraint)
            elif resource == 'is_visible':
                constraint = request.json['constraint']
                query = Note.query.filter_by(is_visible=constraint)
            elif resource == 'location_type':
                constraint = request.json['constraint']
                query = Note.query.filter_by(location_type=constraint)
            elif resource == 'url':
                constraint = request.json['constraint']
                query = Note.query.filter_by(url=constraint, user_id=user_id)
            elif resource == 'x':
                constraint = request.json['constraint']
                query = Note.query.filter_by(x=constraint)
            elif resource == 'y':
                constraint = request.json['constraint']
                query = Note.query.filter_by(y=constraint)
            elif resource == 'none':
                query = Note.query
            else:
                return {"msg": "invalid resource"}, 404
        

        return paginate(query, schema)
    

    def post(self):
        # Create a note 
        schema = NoteSchema()
        note = schema.load(request.json)

        db.session.add(note)
        db.session.commit()

        return {"msg": "note created", "note": schema.dump(note)}, 201

