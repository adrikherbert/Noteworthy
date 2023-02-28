from server.models import Collection
from server.extensions import ma, db
from marshmallow_sqlalchemy import auto_field


class LocationSchema(ma.SQLAlchemySchema):

    id = ma.Int(dump_only=True)
    url = ma.URL()
    note_id = ma.Int()
    coords = ma.Tuple((ma.Int(), ma.Int()))

    class Meta:
        sqla_session = db.session
        load_instance = True
