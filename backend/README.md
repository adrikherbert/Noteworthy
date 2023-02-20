CS307 Noteworthy Backend

A venv must be created prior to doing anything with the backend. To do this (with cwd as \Noteworthy\backend):
```
    python -m venv venv
```

To run venv on a windows machine (with cwd as \Noteworthy\backend):
```Powershell
    Set-ExecutionPolicy -ExecutionPolicy AllSigned -Scope Process
    .\venv\Scripts\activate
```

After the above, install the proper pip files from the provided requirements.txt file:
```
    pip install -r requirements.txt
```


The .env file must be set up prior to running this server locally. After you're all set up, run "flask run" and click the URL provided to you in the terminal.