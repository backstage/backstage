#!/usr/bin/env bash

for FILE in \
  ../../packages/catalog-model/examples/*.yaml \
; do \
  curl \
    --location \
    --request POST 'localhost:7000/catalog/locations' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"type\": \"file\", \"target\": \"../catalog-model/${FILE}\"}"
  echo
done
