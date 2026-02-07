#!/bin/bash

# Base URL
URL="http://localhost:8080/api"

echo "Waiting for backend to be ready..."
sleep 5

# 1. Register (ignore error if exists)
echo "Registering..."
curl -s -X POST "$URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123456"}' > /dev/null

# 2. Login
echo -e "\nLogging in..."
LOGIN_RESP=$(curl -s -X POST "$URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123456"}')
TOKEN=$(echo $LOGIN_RESP | jq -r '.token')
echo "Token: $TOKEN"

if [ "$TOKEN" == "null" ]; then
  echo "Login failed. Response: $LOGIN_RESP"
  exit 1
fi

# 3. Create Domain
echo -e "\nCreating Domain..."
DOMAIN_RESP=$(curl -s -X POST "$URL/domains" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}')
DOMAIN_ID=$(echo $DOMAIN_RESP | jq -r '.id')
echo "Domain ID: $DOMAIN_ID"

# 4. Create API Key
echo -e "\nCreating API Key..."
API_KEY_RESP=$(curl -s -X POST "$URL/api-keys" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"test-key\", \"domain_ids\": [\"$DOMAIN_ID\"]}")
API_KEY=$(echo $API_KEY_RESP | jq -r '.key')
echo "API Key: $API_KEY"

# 5. Track Visit
echo -e "\nTracking Visit..."
curl -s -X POST "$URL/track" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path": "/", "visitor_id": "visitor-101"}'

# 6. Get Badge (Public)
echo -e "\nGetting Badge..."
curl -v "$URL/badges/$DOMAIN_ID/live.svg" > badge.svg
echo "Saved to badge.svg"

# 7. Get Avatar (Public)
echo -e "\nGetting Avatar..."
curl -v "$URL/avatars/visitor-101" > avatar.svg
echo "Saved to avatar.svg"
