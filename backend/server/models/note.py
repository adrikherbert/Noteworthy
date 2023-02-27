from server.extensions import db


class Note(db.Model):
    """Note model"""
    
    id = db.Column(db.Integer, primary_key=True)
    collection_id = db.Column(db.Integer, db.ForeignKey("collection.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user_account.id"), nullable=False)
    access_type = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(1000), nullable=False)
    title = db.Column(db.String(60), nullable=False)
    # How do we store Location?
    # How do we store Reactions?
    # How do we store Comments?

    def to_dict(self):
        return {
            "id": self.id,
            "collection_id": self.collection_id,
            "user_id": self.user_id,
            "access_type": self.access_type,
            "content": self.content,
            "title": self.title,
        }