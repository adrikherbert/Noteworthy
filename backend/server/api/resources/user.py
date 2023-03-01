from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from server.api.schemas import UserAccountSchema
from server.models import UserAccount
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

    method_decorators = [jwt_required()]

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

    @jwt_required()
    def get(self):
        """
        Query for a user list by resource

        TODO: Add option for no resource (get_all)
        """
        schema = UserAccountSchema(many=True)
        resource = request.json['resource']

        query = 0

        if resource == 'id':
            constraint = request.json['constraint']
            query = UserAccount.query.filter_by(id=constraint)
        elif resource == 'username':
            constraint = request.json['constraint']
            query = UserAccount.query.filter_by(username=constraint)
        elif resource == 'email':
            constraint = request.json['constraint']
            query = UserAccount.query.filter_by(email=constraint)
        elif resource == 'active':
            constraint = request.json['constraint']
            query = UserAccount.query.filter_by(active=constraint)
        elif resource == 'none':
            query = UserAccount.query
        else:
            return {"msg": "invalid resource"}, 404
        

        return paginate(query, schema)

    def post(self):
        schema = UserAccountSchema()
        user = schema.load(request.json)

        db.session.add(user)
        db.session.commit()

        return {"msg": "user created", "user": schema.dump(user)}, 201
