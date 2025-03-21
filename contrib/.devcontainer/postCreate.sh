#!/bin/bash
yarn install
export VIRTUAL_ENV=$HOME/venv
python3 -m venv $VIRTUAL_ENV
export PATH="$VIRTUAL_ENV/bin:$PATH"
python3 -m pip install mkdocs-techdocs-core