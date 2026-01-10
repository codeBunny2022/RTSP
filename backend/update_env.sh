#!/bin/bash

# Helper script to update .env file with MongoDB password

echo "MongoDB Atlas Connection String Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    touch .env
fi

echo "Enter your MongoDB password for user 'chiragcrypt_db_user':"
echo "(The password will be URL encoded automatically)"
read -s PASSWORD

# URL encode the password using Python
ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$PASSWORD', safe=''))")

# Update .env file
cat > .env << EOF
MONGO_URI=mongodb+srv://chiragcrypt_db_user:${ENCODED_PASSWORD}@clustercentrl.jnxoe0j.mongodb.net/?appName=ClusterCentrl
DB_NAME=rtsp_overlay
EOF

echo ""
echo "✅ .env file updated successfully!"
echo ""
echo "Testing connection..."
python3 test_connection.py
