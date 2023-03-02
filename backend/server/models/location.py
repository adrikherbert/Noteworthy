from server.extensions import db
from sqlalchemy.dialects.postgresql import TEXT


class Location(db.Model):
    """Location model"""
    
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey("note.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user_account.id"), nullable=False)
    location_type = db.Column(db.Integer, default=0, nullable=False)
    url = db.Column(TEXT, nullable=False)
    x = db.Column(db.Integer, default=-1, nullable=False)
    y = db.Column(db.Integer, default=-1, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "note_id": self.note_id,
            "user_id": self.user_id,
            "location_type": self.location_type,
            "url": self.url,
            "x": self.x,
            "y": self.y
        }
