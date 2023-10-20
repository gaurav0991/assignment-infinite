from pydantic import BaseModel
from datetime import date, datetime

class User(BaseModel):
    username: str
    email: str

class UserInDB(User):
    hashed_password: str

class LoginRequest(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str
    email: str
    profile_pic: str = ""  # Default to an empty string if not provided
    date_of_birth: date = None  # Default to None if not provided
    createddate: datetime = datetime.today()  # Set to today's date by default
    def to_dict(self):
        # Prepare the user data for database insertion
        data = {
            "username": self.username,
            "email": self.email,
            "hashed_password": self.password,
            "profile_pic": self.profile_pic,
            "date_of_birth": self.date_of_birth,
            "createddate": self.createddate
        }
        return data



class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
