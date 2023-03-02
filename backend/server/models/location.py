from server.extensions import db
from sqlalchemy.dialects.postgresql import TEXT, ARRAY


class Location(db.Model):
    """Location model"""
    
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey("note.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user_account.id"), nullable=False)
    url = db.Column(TEXT, nullable=False)
    coords = db.Column(ARRAY(db.Integer), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "note_id": self.note_id,
            "url": self.url,
            "coords": self.coords
        }
