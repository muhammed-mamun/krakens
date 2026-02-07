#!/bin/bash

# Configuration
API_URL="http://localhost:8080/api"
API_KEY="${1:-test-key}" 

echo "Simulating 15 visitors with Key: $API_KEY..."

for i in {1..5}; do
  VISITOR_ID="visitor-$i"
  # echo "Tracking visitor: $VISITOR_ID"
  
  # Print response code
  curl -v -X POST "$API_URL/track" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: $API_KEY" \
    -d "{\"path\": \"/\", \"visitor_id\": \"$VISITOR_ID\"}" 2>&1 | grep "< HTTP" &
    
  sleep 0.1
done

wait
echo -e "\nDone! Check the dashboard."
