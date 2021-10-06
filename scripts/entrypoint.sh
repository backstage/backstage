#!/bin/bash

# app container entrypoint script for starting envconsul as
# a sub-process then running the application

envconsul -config "config.hcl" -log-level debug env \
ADDRESS=1.2.3.4 \
PORT=55

node packages/backend --config app-config.yaml