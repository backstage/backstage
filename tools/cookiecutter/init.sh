#!/usr/bin/env bash

set -e

# Build the container
docker build $(pwd)/tools/cookiecutter -t backstage/tools/cookiecutter --quiet

# Run cookiecutter with our arguments
COOKIECUTTER_FLAGS=${@:-""}
docker run -it -v $(pwd):/app -w /app backstage/tools/cookiecutter $COOKIECUTTER_FLAGS
