#!/bin/bash

openssl req \
  -x509 \
  -newkey rsa:1024 \
  -days 3650 \
  -nodes \
  -subj '/CN=localhost' \
  -keyout "key.pem" \
  -out "cert.pem"
