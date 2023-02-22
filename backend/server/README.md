This is a file to explain the various folders and files within the server, as well as explain how to use Flask.

CLI:
    "flask routes": Shows all available routes as well as the methods and rules.



model/
This is where the main database creations lie. To add a new table, a new model must be made and the relevant columns and foreign relations established.
The name of the table is based on the name of the class. For example: 
    class UserAccount
would be altered to the tablename "user_account". Also, the name of the class must be added to the __init__.py file.

api/resources/
Defines resources loaded by the api. Function names are 1:1 with http protocol. This is where endpoints related to DB access are fleshed out.

api/views/
