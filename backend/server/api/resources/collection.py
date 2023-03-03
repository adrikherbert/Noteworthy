from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from server.api.schemas import CollectionSchema
from server.models import Collection
from server.extensions import db
from server.commons.pagination import paginate

"""
TODO: Constrain retrieval, deletion, and modification to owning users
"""

class CollectionResource(Resource):
    """Retrieve and modify single collections

    ---
    get:
      tags:
        - api
      summary: Get a collection
      description: Get a single collection by ID
      parameters:
        - in: path
          name: collection_id
          schema:
            type: integer
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  note: CollectionSchema
        404:
          description: collection does not exist
    put:
      tags:
        - api
      summary: Update a collection
      description: Update a single collection by ID
      parameters:
        - in: path
          name: collection_id
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              CollectionSchema
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: collection updated
                  collection: CollectionSchema
        404:
          description: collection does not exist
    delete:
      tags:
        - api
      summary: Delete a collection
      description: Delete a single collection by ID
      parameters:
        - in: path
          name: collection_id
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
                    example: collection deleted
        404:
          description: collection does not exist
    """

    # method_decorators = [jwt_required()]

    def get(self, collection_id):
        # get a collection
        schema = CollectionSchema()
        collection = Collection.query.get_or_404(collection_id)
        return {"collection": schema.dump(collection)}

    
    def put(self, collection_id):
        # update a collection
        schema = CollectionSchema(partial=True)
        collection = Collection.query.get_or_404(collection_id)
        collection = schema.load(request.json, instance=collection)

        db.session.commit()

        return {"msg": "collection updated", "collection": schema.dump(collection)}

    
    def delete(self, collection_id):
        # delete a collection
        collection = Collection.query.get_or_404(collection_id)
        db.session.delete(collection)
        db.session.commit()

        return {"msg": "collection deleted"}
    

class CollectionList(Resource):
    """Creation and get all collections

    ---
    get:
      tags:
        - api
      summary: Get a list of collections
      description: Get a list of paginated collections
      parameters:
        - in: query
          name: resource
          type: string
          required: true
          description: comma-separated list of resources to constrain to
          example: parent_id,title
        - in: query
          name: constraint
          type: string
          required: true
          description: comma-separated list of constraints corresponding to each resource
          example: 27,ExampleTitle
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
                          $ref: '#/components/schemas/CollectionSchema'
    post:
      tags:
        - api
      summary: Create a collection
      description: Create a new collection
      requestBody:
        content:
          application/json:
            schema:
              CollectionSchema
      responses:
        201:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: collection created
                  collection: CollectionSchema
    """

    # method_decorators = [jwt_required()]

    def get(self):
        """
        Query for a collection list by resource
        """
        schema = CollectionSchema(many=True)

        if not request.args:
            query = Collection.query
        else:
            resource = request.args.get('resource')
            constraint = request.args.get('constraint')

            resources = resource.split(',')
            constraints = constraint.split(',')

            query = Collection.query

            print(resources)
            print(constraints)

            for r in range(len(resources)):
                if resources[r] == 'id':
                    c = constraints[r]
                    query = query.filter_by(id=int(c))
                elif resources[r] == 'parent_id':
                    c = constraints[r]
                    query = query.filter_by(parent_id=int(c))
                elif resources[r] == 'user_id':
                    c = constraints[r]
                    query = query.filter_by(user_id=int(c))
                elif resources[r] == 'access_type':
                    c = constraints[r]
                    query = query.filter_by(access_type=int(c))
                elif resources[r] == 'title':
                    c = constraints[r]
                    query = query.filter_by(title=c)
                else:
                    return {"msg": "invalid resource"}, 404
        

        return paginate(query, schema)


    def post(self):
        schema = CollectionSchema()
        collection = schema.load(request.json)

        db.session.add(collection)
        db.session.commit()

        return {"msg": "collection created", "collection": schema.dump(collection)}, 201
