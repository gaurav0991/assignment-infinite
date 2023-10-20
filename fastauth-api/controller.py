# controller.py
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

from fastapi import Depends, HTTPException, APIRouter
from models.UserModal import User, UserInDB,UserCreate,Token,LoginRequest
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import Optional

router = APIRouter()

# Configuration settings (change these in a real application)
SECRET_KEY = "your-secret-key"  # Replace with a strong secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Connect to MongoDB (replace with your own connection string)
MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/"
DB_NAME = "infiniteAnaylitics"
COLLECTION_NAME = "users"

client = AsyncIOMotorClient(MONGODB_CONNECTION_STRING)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Create access token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(payload)
        user_id = payload.get("username")
        user = await collection.find_one({"username": user_id}, projection= {"_id": False})
        print(user)
        if user!=None:
            return user
        else:
            raise HTTPException(status_code=401, detail="User not found")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Get user by username from MongoDB
async def get_user(username: str):
    user = await collection.find_one({"username": username})
    if user:
        return UserInDB(**user)

# Authenticate user
async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    print("user")
    print(user)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Models

# Register a new user in MongoDB
@router.post("/register/", response_model=UserInDB)
async def register(user: UserCreate):
    existing_user = await collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = pwd_context.hash(user.password)
    user.password=hashed_password
    result = await collection.insert_one(user.to_dict())
    return UserInDB(id=result.inserted_id, **user.dict(), hashed_password=hashed_password)

# Login and generate access token
@router.post("/login/", response_model=Token)
async def login(userLogin:LoginRequest):
    print("Asdbasd")
    user = await authenticate_user(userLogin.username, userLogin.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"username": str(user.username)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile/", response_model=dict)
async def read_user_profile(current_user: dict = Depends(get_current_user)):
    return current_user

# User story: I can edit my details including: photo, name, bio, phone, email, and password
@router.put("/profile/edit/", response_model=UserInDB)
async def edit_user_profile(
    profile_updates: UserCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    profile_data = profile_updates.to_dict()
    
    updated_user = await collection.find_one_and_update(
        {"_id": current_user.id},
        {"$set": profile_data},
        return_document=True
    )
    if updated_user:
        return UserInDB(**updated_user)
    else:
        raise HTTPException(status_code=400, detail="Profile update failed")

# User story: I can upload a new photo or provide an image URL
@router.put("/profile/photo/", response_model=UserInDB)
async def update_profile_photo(
    photo_url: str,
    current_user: UserInDB = Depends(get_current_user)
):
    # Update the user's profile photo with the provided URL
    updated_user = await collection.find_one_and_update(
        {"_id": current_user.id},
        {"$set": {"photo": photo_url}},
        return_document=True
    )
    if updated_user:
        return UserInDB(**updated_user)
    else:
        raise HTTPException(status_code=400, detail="Profile photo update failed")
