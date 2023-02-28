from server.models import Location
from server.extensions import ma, db


class LocationSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    note_id = ma.Int()

    class Meta:
        model = Location
        sqla_session = db.session
        load_instance = True
