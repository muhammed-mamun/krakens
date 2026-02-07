#!/bin/bash

BASE_URL="http://localhost:8080/api"
EMAIL="tester@example.com"
PASSWORD="PassWord123!"

# 1. Login
TOKEN_RESP=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
TOKEN=$(echo "$TOKEN_RESP" | jq -r '.token')

if [ "$TOKEN" == "null" ]; then
    # Try Registering
    curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}" > /dev/null
    
    # Login again
    TOKEN_RESP=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
    TOKEN=$(echo "$TOKEN_RESP" | jq -r '.token')
fi

if [ "$TOKEN" == "null" ]; then
    echo "Failed to get token"
    exit 1
fi

# 2. Get Domains
DOMAINS_RESP=$(curl -s -X GET "$BASE_URL/domains" \
  -H "Authorization: Bearer $TOKEN")

DOMAIN_ID=$(echo "$DOMAINS_RESP" | jq -r '.[0].id')

if [ "$DOMAIN_ID" == "null" ]; then
    # Create Domain
    DOMAIN_RESP=$(curl -s -X POST "$BASE_URL/domains" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"domain": "test.com"}')
    DOMAIN_ID=$(echo "$DOMAIN_RESP" | jq -r '.id')
fi

# 3. Get API Keys
KEYS_RESP=$(curl -s -X GET "$BASE_URL/api-keys" \
  -H "Authorization: Bearer $TOKEN")

API_KEY=$(echo "$KEYS_RESP" | jq -r '.[0].key')

if [ "$API_KEY" == "null" ]; then
    # Create Key
    KEY_RESP=$(curl -s -X POST "$BASE_URL/api-keys" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"name\": \"test-key\", \"domain_ids\": [\"$DOMAIN_ID\"]}")
    API_KEY=$(echo "$KEY_RESP" | jq -r '.key')
fi
echo "$API_KEY"
