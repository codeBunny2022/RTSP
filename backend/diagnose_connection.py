#!/usr/bin/env python3
"""
Diagnostic script to check MongoDB Atlas connection issues
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import urllib.parse

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', '')
DB_NAME = os.getenv('DB_NAME', 'rtsp_overlay')

print("MongoDB Atlas Connection Diagnostics")
print("=" * 50)
print()

if not MONGO_URI:
    print("❌ MONGO_URI not found in .env file")
    exit(1)

# Parse connection string
try:
    # Extract parts of the connection string
    if 'mongodb+srv://' in MONGO_URI:
        parts = MONGO_URI.replace('mongodb+srv://', '').split('@')
        if len(parts) >= 2:
            auth_part = parts[0]
            if ':' in auth_part:
                username, encoded_password = auth_part.split(':', 1)
                # Try to decode to see what password was encoded
                try:
                    decoded_password = urllib.parse.unquote_plus(encoded_password)
                    print(f"✅ Username: {username}")
                    print(f"✅ Encoded password: {encoded_password}")
                    print(f"✅ Decoded password: {decoded_password}")
                    print(f"   (This is what MongoDB will receive)")
                except:
                    print(f"⚠️  Could not decode password")
    else:
        print("⚠️  Connection string format might be incorrect")
except Exception as e:
    print(f"⚠️  Could not parse connection string: {e}")

print()
print("Testing connection...")
print()

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
    client.server_info()
    print("✅ SUCCESS! Connected to MongoDB Atlas!")
    db = client[DB_NAME]
    collections = db.list_collection_names()
    print(f"✅ Database '{DB_NAME}' is accessible")
    print(f"   Collections: {collections if collections else 'None'}")
    exit(0)
    
except Exception as e:
    error_msg = str(e)
    print(f"❌ Connection failed: {error_msg}")
    print()
    print("Common Issues and Solutions:")
    print("-" * 50)
    
    if "authentication failed" in error_msg.lower() or "bad auth" in error_msg.lower():
        print("🔴 AUTHENTICATION ERROR")
        print()
        print("Possible causes:")
        print("1. ❌ Wrong password")
        print("   → Go to MongoDB Atlas → Database Access")
        print("   → Find user 'chiragcrypt_db_user'")
        print("   → Click 'Edit' → 'Edit Password' to reset")
        print()
        print("2. ❌ Wrong username")
        print("   → Verify username is exactly: chiragcrypt_db_user")
        print()
        print("3. ❌ Password encoding issue")
        print("   → Run: python3 encode_password.py")
        print("   → Copy the encoded password to .env")
        print()
        print("4. ❌ IP address not whitelisted")
        print("   → Go to MongoDB Atlas → Network Access")
        print("   → Click 'Add IP Address'")
        print("   → For testing: Click 'Allow Access from Anywhere' (0.0.0.0/0)")
        print("   → Click 'Confirm'")
        print()
        print("5. ❌ User doesn't have database access")
        print("   → Go to MongoDB Atlas → Database Access")
        print("   → Edit user 'chiragcrypt_db_user'")
        print("   → Under 'Database User Privileges', ensure 'Atlas admin' or custom role")
        
    elif "timeout" in error_msg.lower() or "network" in error_msg.lower():
        print("🔴 NETWORK ERROR")
        print()
        print("Possible causes:")
        print("1. ❌ IP address not whitelisted")
        print("   → Go to MongoDB Atlas → Network Access")
        print("   → Add your IP address or allow 0.0.0.0/0")
        print()
        print("2. ❌ Internet connection issue")
        print("   → Check your internet connection")
        print("   → Try: ping clustercentrl.jnxoe0j.mongodb.net")
        print()
        print("3. ❌ Firewall blocking connection")
        print("   → Check if firewall allows outbound connections on port 27017")
    
    else:
        print("🔴 UNKNOWN ERROR")
        print("   → Check MongoDB Atlas status")
        print("   → Verify cluster is running")
        print("   → Check MongoDB Atlas logs")
    
    print()
    print("Quick Fix Steps:")
    print("1. Verify password in MongoDB Atlas dashboard")
    print("2. Whitelist your IP address (or allow 0.0.0.0/0)")
    print("3. Run: ./fix_password.sh (to update password)")
    print("4. Run: python3 test_connection.py (to test again)")
    
    exit(1)

