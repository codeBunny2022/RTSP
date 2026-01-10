# MongoDB Atlas Setup Instructions

## Your MongoDB Atlas Connection String

Your MongoDB Atlas cluster connection string is:
```
mongodb+srv://chiragcrypt_db_user:<db_password>@clustercentrl.jnxoe0j.mongodb.net/?appName=ClusterCentrl
```

## Setup Steps

1. **Get your database password**
   - Go to MongoDB Atlas dashboard
   - Navigate to Database Access
   - Find the user `chiragcrypt_db_user`
   - If you don't remember the password, you can reset it

2. **Create the .env file**
   ```bash
   cd backend
   ```

3. **Create .env file with your password**
   Replace `YOUR_PASSWORD_HERE` with your actual MongoDB password:
   ```bash
   echo "MONGO_URI=mongodb+srv://chiragcrypt_db_user:YOUR_PASSWORD_HERE@clustercentrl.jnxoe0j.mongodb.net/?appName=ClusterCentrl
   DB_NAME=rtsp_overlay" > .env
   ```

   Or manually create the file:
   ```bash
   nano .env
   ```
   
   Add these lines (replace YOUR_PASSWORD_HERE):
   ```
   MONGO_URI=mongodb+srv://chiragcrypt_db_user:YOUR_PASSWORD_HERE@clustercentrl.jnxoe0j.mongodb.net/?appName=ClusterCentrl
   DB_NAME=rtsp_overlay
   ```

4. **Important: URL Encode Special Characters**
   If your password contains special characters, you need to URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - `%` becomes `%25`
   - `&` becomes `%26`
   - `+` becomes `%2B`
   - `=` becomes `%3D`
   - `?` becomes `%3F`
   - `/` becomes `%2F`
   - ` ` (space) becomes `%20`

   Example: If your password is `MyP@ss#123`, it should be `MyP%40ss%23123`

5. **Test the connection**
   ```bash
   python app.py
   ```
   
   You should see:
   ```
   ✅ Successfully connected to MongoDB: rtsp_overlay
   Running on http://0.0.0.0:5000
   ```

## Network Access

Make sure your IP address is whitelisted in MongoDB Atlas:

1. Go to MongoDB Atlas dashboard
2. Click "Network Access" in the left sidebar
3. Click "Add IP Address"
4. For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note:** This is less secure but convenient for testing
   - For production, add only your server's IP address

## Troubleshooting

### Connection Timeout
- Check that your IP is whitelisted in MongoDB Atlas
- Verify the password is correct
- Check that special characters are URL encoded

### Authentication Failed
- Verify the username is correct: `chiragcrypt_db_user`
- Double-check the password
- Make sure the user has read/write permissions

### DNS Resolution Error
- Check your internet connection
- Verify the cluster URL is correct: `clustercentrl.jnxoe0j.mongodb.net`
