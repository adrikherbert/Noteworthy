from server.models import Collection
from server.extensions import ma, db


class CollectionSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)

    class Meta:
        model = Collection
        sqla_session = db.session
        load_instance = True