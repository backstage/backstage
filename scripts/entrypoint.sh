#!/bin/bash

# app container entrypoint script for starting envconsul as
# a sub-process then running the application

envconsul -log-level debug -config "config.hcl" env

node packages/backend --config app-config.yaml