#!/bin/bash
export ENV APP_CONFIG_app_baseUrl=$UFFIZZI_URL
export ENV APP_CONFIG_backend_baseUrl=$UFFIZZI_URL
export ENV APP_CONFIG_auth_environment="production"
node packages/backend --config app-config.yaml --config app-config.production.yaml
