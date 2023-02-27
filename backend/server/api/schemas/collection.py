from server.models import Collection
from server.extensions import ma, db


class CollectionSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    user_id = ma.Int()
    parent_id = ma.Int()
    notes = ma.List(ma.Int())

    class Meta:
        model = Collection
        sqla_session = db.session
        load_instance = True
