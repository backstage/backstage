#!/bin/bash

set -euo pipefail

# Cleanes up orphaned entities for the provided Backstage URL, defaults to the local backend
BACKSTAGE_URL=${1:-'http://localhost:7007'}
echo $BACKSTAGE_URL

ORPHAN_API_URL="$BACKSTAGE_URL/api/catalog/entities?filter=metadata.annotations.backstage.io/orphan=true"
ORPHAN_DELETE_API_URL="$BACKSTAGE_URL/api/catalog/entities/by-uid"

ORPHANS=$(curl -s $ORPHAN_API_URL)

echo ""
echo "Found $(echo $ORPHANS | jq length ) orphaned entities"
echo ""

jq -c '.[]' <<< $ORPHANS | while read ORPHAN; do
    echo $ORPHAN | jq "."
    echo "Deleting orphan entity: $(echo $ORPHAN | jq -r .metadata.name) of kind: $(echo $ORPHAN | jq -r .kind)"
    curl -X DELETE "$ORPHAN_DELETE_API_URL/$(echo $ORPHAN | jq -r .metadata.uid)"
done
