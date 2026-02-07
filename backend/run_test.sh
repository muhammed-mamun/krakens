#!/bin/bash
set -e

echo "Getting API Key..."
# We need to source get_key.sh or parse its output more carefully to get DOMAIN_ID as well.
# Let's just do it inline here to be safe and get both ID and Key.

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

echo "API Key: $API_KEY"
echo "Domain ID: $DOMAIN_ID"

echo "Running Simulation..."
./simulate_traffic.sh "$API_KEY"

# Wait a second for persistence
sleep 2

echo "Verifying API Response..."
# Pass domain_id param!
STATS=$(curl -s -X GET "http://localhost:8080/api/stats/realtime?domain_id=$DOMAIN_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Stats Response:"
# Pretty print and extract active visitor IDs count
echo "$STATS" | jq '{active: .active_visitors, ids_count: (.active_visitor_ids | length), ids: .active_visitor_ids}'
