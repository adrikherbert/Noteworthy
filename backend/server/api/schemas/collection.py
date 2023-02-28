from server.models import Collection
from server.extensions import ma, db
from marshmallow_sqlalchemy import auto_field


class CollectionSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    parent_id = ma.Int()
    user_id = ma.Int()

    class Meta:
        model = Collection
        sqla_session = db.session
        load_instance = True
