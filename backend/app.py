from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from astrapy import DataAPIClient
import bcrypt
import uuid
from datetime import datetime
import pytz
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os
from pprint import pprint

# SIB_KEY = os.environ.get("SIB_KEY")
ASTRA_TOKEN = os.environ.get("ASTRA_TOKEN")


app = FastAPI()

app.add_middleware (
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


TOKEN = ASTRA_TOKEN
client = DataAPIClient(TOKEN)
db = client.get_database_by_api_endpoint(
  "https://d96e5250-e4a8-4934-887f-65bd55056c15-us-east-2.apps.astra.datastax.com"
)

print(f"Connected to Astra DB: {db.list_collection_names()}")

userTable = db.get_table("users")
dataTable = db.get_table("data")


def encryptPassword(password):
   salt = bcrypt.gensalt()
   return bcrypt.hashpw(password.encode("utf-8"), salt).decode()


def checkPass(password, hashedPass):
   if bcrypt.checkpw(password.encode("utf-8"), hashedPass.encode("utf-8")):
      return True
   return False

def emissionCalcTransport(transport):
   if transport == "walking/biking":
      return 0
   elif transport == "electric/hybrid car":
      return 0.0002
   elif transport == "gas car":
      return 0.0089
   elif transport == "bus":
      return 0.00014
   elif transport == "train":
      return 0.00014
   else:
      return 0.002

def emissionCalcFood(food):
   if food == "every meal":
      return 1.3
   elif food == "one meal":
      return 1
   elif food == "no beef":
      return 0.79
   elif food == "veg":
      return 0.66
   else:
      return 0.56

def emissionCalcHome(home):
   if home == "very":
      return 0.00096
   elif home == "somewhat":
      return 0.005955
   else:
      return 0.011

def emissionCalcWaste(waste):
   if waste == "yes":
      return 0
   elif waste == "tried":
      return 0.01355
   else:
      return 0.015
   


class UserSignUp(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str
    repass: str
@app.post("/signUp")
def signup(data: UserSignUp):
  firstname = data.firstname
  lastname = data.lastname
  email = data.email
  password = data.password
  repass = data.repass



  if password != repass:
     response = {
        "message": "Failure. Pass No Match"
     }
     return JSONResponse(response)
  else:
     existingUser = list(userTable.find({"email": email}))
     if (existingUser):
        response = {
           "message": "Failure. Account Already Exists!"
        }
        return JSONResponse(response)
     else:
        id = uuid.uuid4()
        hashedPass = encryptPassword(password)
        userData = {
           "id": str(id),
           "firstname": firstname,
           "lastname": lastname,
           "email": email,
           "password": hashedPass
        }
        userTable.insert_one(userData)
        response = {
           "message": "Success!"
        }
        return JSONResponse(response)


class UserLogIn(BaseModel):
   email: str
   password: str
@app.post("/logIn")
def login(data: UserLogIn):
   email = data.email
   password = data.password

   existingUser = list(userTable.find({"email": email}))
   if (existingUser):
      if (checkPass(password, existingUser[0]["password"])):
         existingData = list(dataTable.find({"userid": existingUser[0]["id"]}))
         if (existingData):
            response = {
               "message": "Success",
               "user": {
                  "id": str(existingUser[0]["id"]),
                  "firstName": existingUser[0]["firstname"],
                  "email": existingUser[0]["email"],
                  "date": str(existingData[0]["date"])
               },
               "data": {
                  "userId": str(existingUser[0]["id"]),
                  "emission": existingData[0]["emission"],
                  "date": str(existingData[0]["date"])
               }
            }
         else:
            response = {
               "message": "Success",
               "user": {
                  "id": str(existingUser[0]["id"]),
                  "firstName": existingUser[0]["firstname"],
                  "email": existingUser[0]["email"],
               }
            }
         return JSONResponse(response)
   response = {
      "message": "Failure"
   }
   return JSONResponse(response)
      

class quizData(BaseModel):
   transport: str
   miles: str
   home: str
   food: str
   waste: str
   user: str
@app.post("/quizData")
def quizData(data: quizData):
   transport = data.transport
   miles = float(data.miles)
   home = data.home
   food = data.food
   waste = data.waste
   userId = data.user


   transportEm = emissionCalcTransport(transport) * float(miles)
   homeEm = emissionCalcHome(home)
   foodEm = emissionCalcHome(food)
   wasteEm = emissionCalcHome(waste)

   sum = float(transportEm + homeEm + foodEm + wasteEm)

   pst = pytz.timezone("America/Los_Angeles")
   pstTime = datetime.now(pst).replace(microsecond=0).isoformat()


   existingData = dataTable.find_one({"userid": userId})
   if not existingData:
      emissionData = {
         "emission": [sum],
         "date": [pstTime],
         "userid": str(userId)
      }   

      dataTable.insert_one(emissionData)
      existingData = dataTable.find_one({"userid": userId})

      print(existingData["emission"])
      print(str(existingData["date"]))

      response = {
         "message": "Success",
         "data": {
            "userId": str(userId),
            "emission": existingData["emission"],
            "date": str(existingData["date"])
         }
      }
      return JSONResponse(response)
   else:
      emissions = existingData.get("emission", [])
      emissions.append(sum)

      dates = existingData.get("date", [])
      dates.append(pstTime)

      filter_query = {"userid": userId}
      update = {
         "$set": {
            "emission": emissions,
            "date": dates
         }
      }
      dataTable.update_one(filter_query, update)
      existingData = dataTable.find_one({"userid": userId})

      print(existingData["emission"])
      print(str(existingData["date"]))

      response = {
         "message": "Success",
         "data": {
            "userId": str(userId),
            "emission": existingData["emission"],
            "date": str(existingData["date"])
         }
      }
      return JSONResponse(response)


@app.post("/keepactive")
def active():
    return JSONResponse("activated")

#uvicorn app:app --reload --port 8000 ----->> To run the backend