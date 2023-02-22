This is a file to explain the various folders and files within the server, as well as explain how to use Flask.

CLI:
    "flask routes": Shows all available routes as well as the methods and rules.


**api/resources/**
Defines resources loaded by the api. Function names are 1:1 with http protocol. This is where endpoints related to DB access are fleshed out.

**api/schemas**
Database object serialization. It's for Marshmallow. **Look into this more**

**api/views.py**
Defines blueprints and resources for other applications to programmatically access resources within the API. This is the "view" of the application, defining the resources accessible to users of the API.

**auth/helpers.py**
Defines helper functions for adding tokens to database, and blocklisting.

**auth/views.py**
Defines views for authentication (i.e. authentication resources visible to API users). See *api/views.py*.

**commons/apispec.py**
Defines API specifications for aiding in API visualization and documentation. Not entirely sure about the inner workings of this script. **Look into this more**.

**commons/pagination.py**
Helpers for paginating queries? Unsure. **Look into this more**.

**model/**
This is where the main database creations lie. To add a new table, a new model must be made and the relevant columns and foreign relations established.
The name of the table is based on the name of the class. For example: 
    class UserAccount
would be altered to the tablename "user_account". Also, the name of the class must be added to the \__init__.py file.

**model/blocklist.py**
Defines database model for token blocklists.

**model/user.py**
Defines database model for user accounts.

**app.py**
Builds and initializes application.

**config.py**
Defines default configurations for application.

**extensions.py**
Define and initialize extension instances (db, jwt, marshmallow, etc.)

**manage.py**
Performs some managerial initialization.

**wsgi.py**
Production initialization.
