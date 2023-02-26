from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from server.api.schemas import CollectionSchema
from server.models import Collection
from server.extensions import db
from server.commons.pagination import paginate


class CollectionResource(Resource):
    """Setting and retrieving collection resources
    ---
    """

    method_decorators = [jwt_required()]

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

    """
    def delete(self, collection_id):
        # delete a collection
        return
    """

class CollectionList(Resource):
    """Collection creation and get_all
    ---
    """

    method_decorators = [jwt_required()]

    """
    def get(self):
        # get all collections / from user / from group
        return
    """

    def post(self):
        schema = CollectionSchema()
        
        collection = schema.load(request.json)

        db.session.add(collection)
        db.session.commit()

        print(schema.dump(collection))

        return {"msg": "collection created", "collection": schema.dump(collection)}, 201
