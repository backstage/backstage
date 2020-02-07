###
# All-in-one commands
###
init: init-secrets
install: install-homebrew-dependencies install-yarn-dependencies install-forego
start: build-protocol-definitions
	forego start

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
# Install Forego for running both frontend and backend in a single command.
###
install-forego:
	go get -u github.com/ddollar/forego

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
