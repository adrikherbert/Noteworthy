from enum import Enum

class AccessType(Enum):
    """
    AccessType Enum for privacy settings

    PUBLIC = 0\n
    PRIVATE = 1
    """
    
    PUBLIC = 0
    PRIVATE = 1


class Reaction(Enum):
    """
    AccessType Enum for note reactions

    THUMBSUP = 0\n
    THUMBSDOWN = 1
    """

    THUMBSUP = 0
    THUMBSDOWN = 1


class LocationType(Enum):
    """
    LocationType Enum for locations 

    COORD = 0\n
    HTML = 1
    """ 

    COORD = 0
    HTML = 0