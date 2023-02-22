This is a file to explain the various folders and files within the server, as well as explain how to use Flask.

General Info:
    All tables in the database will likely have: 
        - A model file in models/
        - A resource file in api/resources/
        - A schema file in api/schemas/
    Tables that are being tested will likely have:
        - A factory in tests/factories.py
        - A registration of the above factory in tests/conftest.py


CLI:
    "flask routes":  Shows all available routes as well as the methods and rules.
    "flask run":     This runs the server locally.
    "flask migrate [-m 'comment']": Pushes the changes to the database. This will fail if the class name has not been added to all the proper places.
                                    DO NOT name a class the same name as a default PostgreSQL table. This is annoying to fix.


models/
This is where the main database creations lie. To add a new table, a new model must be made and the relevant columns and foreign relations established.
The name of the table is based on the name of the class. For example: 
    class UserAccount
would be altered to the tablename "user_account". Also, the name of the class must be added to the \_\_init\_\_.py file.


api/resources/
Defines resources loaded by the api. Function names are 1:1 with http protocol. This is where endpoints related to DB access are fleshed out.


api/views/
This is where all resources defined above are added to the api. They're under an umbrella Blueprint of api/v1.