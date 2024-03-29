from server.extensions import db
from sqlalchemy.dialects.postgresql import ARRAY


class Collection(db.Model):
    """Collection model"""
    
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey("collection.id"), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user_account.id"), nullable=False)
    access_type = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(60), nullable=False)
    notes = db.Column(ARRAY(db.Integer), nullable=True)


    def to_dict(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "user_id": self.user_id,
            "access_type": self.access_type,
            "title": self.title,
            "notes": self.notes
        }
