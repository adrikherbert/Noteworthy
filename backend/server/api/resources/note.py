from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.api.schemas import NoteSchema, LocationSchema
from server.models import Note, Location
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
                    is_visible:
                      type: boolean 
                      example: true 
                location:
                  type: object
                  properties:
                    url:
                      type: string
                      example: https://example.com
                    location_type:
                      type: integer 
                      example: 0
                    x:
                      type: integer
                      example: 0
                    y:
                      type: integer
                      example: 0
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
            elif resource == 'none':
                query = Note.query
            else:
                return {"msg": "invalid resource"}, 404
        

        return paginate(query, schema)
    

    def post(self):
        # Define Note and Location Schemas
        note_schema = NoteSchema()
        location_schema = LocationSchema()

        # Get note and location JSON from request
        note = request.json.get("note")
        location = request.json.get("location")
        user_id = note["user_id"]
        print(user_id)

        # Load note into schema and commit
        note = note_schema.load(note)
        db.session.add(note)
        db.session.commit()

        # Get note_id from note.id in db, add to location
        note_id = note_schema.dump(note).get("id")
        location = request.json.get("location")
        location["note_id"] = note_id
        location["user_id"] = user_id
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


class NoteByPage(Resource):
    """Get all notes by URL

    ---
    get:
      tags:
        - api
      summary: Get a list of notes and their locations by URL
      description: Get a list of notes and their locations
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                url:
                  type: string
                  example: https://example.com
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  note <i>:
                    type: object
                    properties:
                      note: NoteSchema
                      location: LocationSchema
        204:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: no notes found
        400:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: invalid request body (no url)

    """

    method_decorators = [jwt_required()]

    def get(self):
        note_schema = NoteSchema()
        location_schema = LocationSchema()
        user_id = get_jwt_identity()

        url = request.json.get("url")
        if not url:
            return {"msg": "invalid request body"}, 400

        payload = {}

        locations = Location.query.filter_by(url=url, user_id=user_id)
        for location in locations:
            note = Note.query.get(location.note_id)

            note_dict = {}
            location_dict = {}
            note_dict['note'] = note.to_dict()
            location_dict['location'] = location.to_dict()

            payload[f'note {note.id}'] = {}
            payload[f'note {note.id}'].update(note_dict)
            payload[f'note {note.id}'].update(location_dict)
        
        if not payload:
            return {"msg": "no notes found"}, 204
 
        
        return make_response(jsonify(payload), 200)
