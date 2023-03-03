from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from server.api.schemas import UserAccountSchema, CollectionSchema
from server.models import UserAccount, TokenBlocklist, Collection, Note
from server.extensions import db
from server.commons.pagination import paginate


class UserAccountResource(Resource):
    """Single object resource

    ---
    get:
      tags:
        - api
      summary: Get a user
      description: Get a single user by ID
      parameters:
        - in: path
          name: user_id
          schema:
            type: integer
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  user: UserAccountSchema
        404:
          description: user does not exists
    put:
      tags:
        - api
      summary: Update a user
      description: Update a single user by ID
      parameters:
        - in: path
          name: user_id
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              UserAccountSchema
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: user updated
                  user: UserAccountSchema
        404:
          description: user does not exists
    delete:
      tags:
        - api
      summary: Delete a user
      description: Delete a single user by ID
      parameters:
        - in: path
          name: user_id
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
                    example: user deleted
        404:
          description: user does not exists
    """

    # method_decorators = [jwt_required()]

    def get(self, user_id):
        schema = UserAccountSchema()
        user = UserAccount.query.get_or_404(user_id)
        return {"user": schema.dump(user)}

    def put(self, user_id):
        schema = UserAccountSchema(partial=True)
        user = UserAccount.query.get_or_404(user_id)
        user = schema.load(request.json, instance=user)

        db.session.commit()

        return {"msg": "user updated", "user": schema.dump(user)}

    def delete(self, user_id):
        user = UserAccount.query.get_or_404(user_id)

        Note.query.filter_by(user_id=user_id).delete()
        Collection.query.filter_by(user_id=user_id).delete()
        TokenBlocklist.query.filter_by(user_id=user_id).delete()

        db.session.delete(user)
        db.session.commit()

        return {"msg": "user deleted"}


class UserAccountList(Resource):
    """Creation and get_all

    ---
    get:
      tags:
        - api
      summary: Get a list of users
      description: Get a list of paginated users
      parameters:
        - in: query
          name: resource
          type: string
          required: true
          description: comma-separated list of resources to constrain to
          example: username,active
        - in: query
          name: constraint
          type: string
          required: true
          description: comma-separated list of constraints corresponding to each resource
          example: Test,true
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
                          $ref: '#/components/schemas/UserAccountSchema'
    post:
      tags:
        - api
      summary: Create a user
      description: Create a new user
      requestBody:
        content:
          application/json:
            schema:
              UserAccountSchema
      responses:
        201:
          content:
            application/json:
              schema:
                type: object
                properties:
                  msg:
                    type: string
                    example: user created
                  user: UserAccountSchema
    """

    # @jwt_required()
    def get(self):
        """
        Query for a user list by resource
        """
        schema = UserAccountSchema(many=True)

        if not request.args:
            query = UserAccount.query
        else:
            resource = request.args.get('resource')
            constraint = request.args.get('constraint')

            resources = resource.split(',')
            constraints = constraint.split(',')

            print(resources)
            print(constraints)

            query = UserAccount.query

            for r in range(len(resources)):
                if resources[r] == 'id':
                    c = constraints[r]
                    query = query.filter_by(id=int(c))
                elif resources[r] == 'username':
                    c = constraints[r]
                    query = query.filter_by(username=c)
                elif resources[r] == 'email':
                    c = constraints[r]
                    query = query.filter_by(email=c)
                elif resources[r] == 'active':
                    c = constraints[r]
                    query = query.filter_by(active=(c=='true'))
                else:
                    return {"msg": "invalid resource"}, 404
        

        return paginate(query, schema)

    def post(self):
        schema = UserAccountSchema()
        user = schema.load(request.json)
        query = UserAccount.query.filter_by(email=user.email).scalar()

        if query:
            return {"msg": "user already exists"}, 400
        
        db.session.add(user)
        db.session.commit()

        collection_schema = CollectionSchema(partial=True)
        collection = {"user_id": user.id, "access_type": 0, "title": "General"}
        collection = collection_schema.load(collection)

        db.session.add(collection)
        db.session.commit()

        root_collection_id = {"root_collection_id": collection.id}

        partial_user_schema = UserAccountSchema(partial=True)
        user = partial_user_schema.load(root_collection_id, instance=user)

        db.session.commit()
        return {"msg": "user created", "user": schema.dump(user), "root_collection": collection_schema.dump(collection)}, 201

        
