from server.extensions import db


class Collection(db.Model):
    """Collection model"""
    
    id = db.Column(db.Integer, primary_key=True)
    access_type = db.Column(db.Integer, nullable=False)
    parent_id = db.Column(db.Integer, nullable=False) # Do we need to define a specific db relationship here?
    # How do we store Notes?


    def to_dict(self):
        return {
            "id": self.id,
            "access_type": self.access_type,
            "parent_id": self.parent_id,
        }
