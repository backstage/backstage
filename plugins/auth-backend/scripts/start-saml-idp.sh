#!/bin/bash

if [[ ! -f idp-public-cert.pem ]]; then
  echo "Generating new SAML Certificates"
  openssl req \
    -x509 \
    -newkey rsa:1024 \
    -days 3650 \
    -nodes \
    -subj '/CN=localhost' \
    -keyout "idp-private-key.pem" \
    -out "idp-public-cert.pem"
fi

echo "Downloading and starting SAML-IdP"
export NPM_CONFIG_REGISTRY=https://registry.npmjs.org
exec npx saml-idp --acsUrl "http://localhost:3003/auth/saml/handler/frame" --audience "http://localhost:3003"
