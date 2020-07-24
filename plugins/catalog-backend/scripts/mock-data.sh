#!/usr/bin/env bash

for URL in \
  'artist-lookup-component.yaml' \
  'playback-order-component.yaml' \
  'podcast-api-component.yaml' \
  'queue-proxy-component.yaml' \
  'searcher-component.yaml' \
  'playback-lib-component.yaml' \
  'www-artist-component.yaml' \
  'shuffle-api-component.yaml' \
; do \
  curl \
    --location \
    --request POST 'localhost:7000/catalog/locations' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"type\": \"github\", \"target\": \"https://github.com/spotify/backstage/blob/master/packages/catalog-model/examples/${URL}\"}"
  echo
done

curl \
    --location \
    --request POST 'localhost:7000/catalog/locations' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"type\": \"github\", \"target\": \"https://github.com/benjdlambert/cookiecutter-golang/blob/master/template.yaml\"}"
echo

