#!/bin/bash

set -e

## build app
cd ~/kod/backstage-frontend/packages/techdocs-cli-embedded-app-4-spotify/
yarn build

## run cli
REPO_ROOT=~/kod/backstage

cd $REPO_ROOT/packages/techdocs-cli/src/
rm -rf dist
cp -r ~/kod/backstage-frontend/packages/techdocs-cli-embedded-app-4-spotify/dist .

cd $REPO_ROOT
yarn workspace @techdocs/cli build
cd ~/kod/docs/
~/kod/backstage/packages/techdocs-cli/bin/techdocs-cli serve --preview-app-bundle-path ~/kod/backstage/packages/techdocs-cli/src/dist
