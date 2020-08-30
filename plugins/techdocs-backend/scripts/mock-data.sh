#!/usr/bin/env bash

for URL in \
  'documented-component/documented-component.yaml' \
; do \
  curl \
    --location \
    --request POST 'localhost:7000/catalog/locations' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"type\": \"file\", \"target\": \"$(pwd)/examples/${URL}\"}"
  echo
done
