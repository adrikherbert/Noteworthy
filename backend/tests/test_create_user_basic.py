import requests

BASE = "http://127.0.0.1:5000/"

new_user = {"username": "new_user", "password": "abc123"}

response = requests.post(BASE + "api/v1/users/add", json=new_user)
print(response.json())