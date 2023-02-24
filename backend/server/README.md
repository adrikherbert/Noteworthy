This is a file to explain the various folders and files within the server, as well as explain how to use Flask.

**General Info**
    All tables in the database will likely have: 
        - A model file in models/
        - A resource file in api/resources/
        - A schema file in api/schemas/
    Tables that are being tested will likely have:
        - A factory in tests/factories.py
        - A registration of the above factory in tests/conftest.py


**CLI**
    "flask routes":  Shows all available routes as well as the methods and rules.
    "flask run":     This runs the server locally.
    "flask db migrate [-m 'comment']": Pushes the changes to the database. This will fail if the class name has not been added to all
        the proper places. DO NOT name a class the same name as a default PostgreSQL table. This is annoying to fix.


**Current directory**
This is where the server lies

**app.py**
This is where the Flask app is created.

**config.py**

**manage.py**
This contains additional Flask CLI commands, custom created.


**api/**
General folder to hold the database-accessing endpoints

**api/resources/**
Defines resources loaded by the api. Function names are 1:1 with http protocol. This is where endpoints related to DB access are fleshed out.

**api/schemas**
Define schemas for dumping and loading ORM objects. Using ma.SQLAlchemyAutoSchema auto-generates the schema for serializing database models. The Meta class is used to establish metadata for the schema. You can also use ma.SQLAlchemySchema to manually define schema patterns. See the link below

**api/views.py**
Defines the umbrella blueprint and connects resources to the API. This is the "view" of the application, defining the resources accessible to users of the API.


**auth/**
General folder to hold auth endpoints

**auth/helpers.py**
Defines helper functions for adding tokens to database, and blocklisting.

**auth/views.py**
Defines views for authentication (i.e. authentication resources visible to API users). See *api/views.py*.


**commons/**
General folder, unsure

**commons/apispec.py**
Defines API specifications for aiding in API visualization and documentation. Not entirely sure about the inner workings of this script. **Look into this more**.

**commons/pagination.py**
Helpers for paginating queries? Unsure. **Look into this more**.


**models/**
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
