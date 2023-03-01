from server.models import Note
from server.extensions import ma, db
from server.api.schemas.location import LocationSchema


class NoteSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    collection_id = ma.Int()
    user_id = ma.Int()
    location = ma.Int()

    class Meta:
        model = Note
        sqla_session = db.session
        load_instance = True
