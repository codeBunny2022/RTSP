#!/usr/bin/env python3
"""
Helper script to URL encode your MongoDB password
"""
import urllib.parse

print("MongoDB Password URL Encoder")
print("=" * 40)
print()

password = input("Enter your MongoDB password: ")

# URL encode the password using quote_plus (required for MongoDB)
encoded_password = urllib.parse.quote_plus(password)

print()
print("Original password:", password)
print("URL encoded password:", encoded_password)
print()
print("Your connection string should be:")
print(f"MONGO_URI=mongodb+srv://chiragcrypt_db_user:{encoded_password}@clustercentrl.jnxoe0j.mongodb.net/?appName=ClusterCentrl")
print()
print("Copy this line to your .env file")
