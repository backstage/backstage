#!/usr/bin/env bash

# Run nginx as root
sed -i 's/user  nginx.*$//' /etc/nginx/nginx.conf

# Write selected env vars to nginx config
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
