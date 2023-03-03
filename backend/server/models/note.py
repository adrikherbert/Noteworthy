from server.extensions import db
from sqlalchemy.dialects.postgresql import ARRAY, TEXT


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
    is_visible = db.Column(db.Boolean, default=True, nullable=False)
    location_type = db.Column(db.Integer, default=0, nullable=False)
    url = db.Column(TEXT, nullable=False)
    x = db.Column(db.Integer, default=-1, nullable=False)
    y = db.Column(db.Integer, default=-1, nullable=False)
    start_offset = db.Column(db.Integer, nullable=True)
    end_offset = db.Column(db.Integer, nullable=True)
    node_data = db.Column(db.String, nullable=True)
    node_html = db.Column(db.String, nullable=True)
    node_tag_name = db.Column(db.String, nullable=True)

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
            "is_visible": self.is_visible,
            "location_type": self.location_type,
            "url": self.url,
            "x": self.x,
            "y": self.y
        }
