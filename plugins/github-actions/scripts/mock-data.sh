#!/usr/bin/env bash

  curl \
    --location \
    --request POST 'localhost:7000/catalog/locations' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"type\": \"file\", \"target\": \"$(pwd)/scripts/sample.yaml\"}"
  echo
