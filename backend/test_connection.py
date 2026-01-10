#!/usr/bin/env python3
"""
Test MongoDB Atlas connection
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', '')
DB_NAME = os.getenv('DB_NAME', 'rtsp_overlay')

if not MONGO_URI:
    print("❌ MONGO_URI not found in .env file")
    print("Please create .env file with your MongoDB connection string")
    exit(1)

if 'YOUR_PASSWORD_HERE' in MONGO_URI:
    print("❌ Please replace YOUR_PASSWORD_HERE with your actual MongoDB password in .env file")
    exit(1)

print(f"Attempting to connect to MongoDB...")
print(f"Database: {DB_NAME}")
print(f"Connection string: {MONGO_URI.split('@')[0]}@...")  # Hide password

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
    # Test the connection
    client.server_info()
    print("✅ Successfully connected to MongoDB Atlas!")
    
    # Test database access
    db = client[DB_NAME]
    collections = db.list_collection_names()
    print(f"✅ Database '{DB_NAME}' is accessible")
    print(f"   Existing collections: {collections if collections else 'None (will be created automatically)'}")
    
    # Test write access
    test_collection = db['test_connection']
    test_collection.insert_one({'test': True, 'timestamp': 'connection_test'})
    test_collection.delete_one({'test': True})
    print("✅ Write access confirmed")
    
    print("\n🎉 MongoDB connection is working perfectly!")
    print("You can now start the Flask server with: python app.py")
    
except Exception as e:
    print(f"\n❌ Connection failed: {e}")
    print("\nTroubleshooting:")
    print("1. Check that your password is correct in .env file")
    print("2. Make sure special characters in password are URL encoded")
    print("3. Verify your IP address is whitelisted in MongoDB Atlas")
    print("4. Check your internet connection")
    exit(1)
