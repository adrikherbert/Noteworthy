from server.models import Note
from server.extensions import ma, db


class NoteSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)

    class Meta:
        model = Note
        sqla_session = db.session
        load_instance = True