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
                  type: array
                  example: ['user_id', 'title']
                constraint:
                  type: array
                  example: [0, 'example']
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
        schema = NoteSchema(many=True)

        if not request.json:
            query = Note.query
        else:
            resources = request.json.get('resource')
            constraints = request.json.get('constraint')

            query = Note.query

            for r in range(len(resources)):
                if resources[r] == 'id':
                    c = constraints[r]
                    query = query.filter_by(id=c)
                elif resources[r] == 'collection_id':
                    c = constraints[r]
                    query = query.filter_by(parent_id=c)
                elif resources[r] == 'user_id':
                    c = constraints[r]
                    query = query.filter_by(user_id=c)
                elif resources[r] == 'access_type':
                    c = constraints[r]
                    query = query.filter_by(access_type=c)
                elif resources[r] == 'content':
                    c = constraints[r]
                    query = query.filter_by(content=c)
                elif resources[r] == 'title':
                    c = constraints[r]
                    query = query.filter_by(title=c)
                elif resources[r] == 'is_visible':
                    c = constraints[r]
                    query = query.filter_by(is_visible=c)
                elif resources[r] == 'location_type':
                    c = constraints[r]
                    query = query.filter_by(location_type=c)
                elif resources[r] == 'url':
                    c = constraints[r]
                    query = query.filter_by(url=c)
                elif resources[r] == 'x':
                    c = constraints[r]
                    query = query.filter_by(x=c)
                elif resources[r] == 'y':
                    c = constraints[r]
                    query = query.filter_by(y=c)
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

