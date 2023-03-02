from server.extensions import db
from sqlalchemy.dialects.postgresql import ARRAY


class Note(db.Model):
    """Note model"""
    
    id = db.Column(db.Integer, primary_key=True)
    collection_id = db.Column(db.Integer, db.ForeignKey("collection.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user_account.id"), nullable=False)
    access_type = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(1000), nullable=False)
    title = db.Column(db.String(60), nullable=False)
    comments = db.Column(ARRAY(db.String(1000)), nullable=True)
    reactions = db.Column(ARRAY(db.Integer), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "collection_id": self.collection_id,
            "user_id": self.user_id,
            "access_type": self.access_type,
            "content": self.content,
            "title": self.title,
            "comments": self.comments,
            "reactions": self.reactions,
        }
