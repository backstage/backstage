###
# All-in-one commands
###
init: init-secrets
install: install-homebrew-dependencies install-yarn-dependencies
start: build-protocol-definitions start-backends start-frontend
stop: stop-backends

###
# Setup secrets
###
init-secrets:
	cp secrets.env.example secrets.env

###
# Install any Homebrew dependencies specified in Brewfile
###
install-homebrew-dependencies:
	brew bundle

###
# Download dependencies from the Frontend using Yarn.
###
install-yarn-dependencies:
	yarn --cwd ${PWD}/frontend install

###
# Protobuf Definitions.
# This will generate Protobuf definitions from ./proto to both Go and JS/TypeScript.
###
build-protocol-definitions:
	prototool generate ${PWD}/proto

###
# Create new frontend plugin.
# This will run Cookiecutter to generate a new Backstage frontend plugin.
###
scaffold-new-frontend-plugin:
	${PWD}/tools/cookiecutter/init.sh frontend/packages/plugins/_template --output-dir frontend/packages/plugins

###
# Run the backend services
###
start-backends:
	${PWD}/docker-compose.yaml up --build --detach

stop-backends:
	${PWD}/docker-compose.yaml down

###
# Run the frontend services.
###
start-frontend:
	yarn --pwd ${PWD}/frontend start
