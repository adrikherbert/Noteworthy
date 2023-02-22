from server.models import UserAccount
from server.extensions import ma, db


class UserSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    password = ma.String(load_only=True, required=True)

    class Meta:
        model = UserAccount
        sqla_session = db.session
        load_instance = True
        exclude = ("_password",)
