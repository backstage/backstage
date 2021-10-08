#!/bin/bash

# app container entrypoint script for starting envconsul as
# a sub-process then running the application

/bin/envconsul -consul-addr=${CONSUL_ADDR} -consul-token=${CONSUL_TOKEN} -prefix="config/bih/development" node packages/backend --config app-config.yaml