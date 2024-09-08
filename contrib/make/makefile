################################################################################
# Copyright 2024 The Backstage Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
################################################################################
# 
# Makefile for Backstage
# This Makefile is used to simplify commands for common tasks.
#
# Linux and macOS: `make` is usually available in a default installation.
# Windows: You can use `make` with Windows Subsystem for Linux or Git BASH.
#          Git BASH: https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058#make
#
# Usage: make [target]
# From the root directory, you can run the following command:
#   make --file ./contrib/make/makefile [target]
# 
# Default target: all
#
# Available targets:
#   initialize           Initialize the project.
#   init                 Alias for initialize.
#   install-all-types    Install all types.
#   install-all-builds   Install all builds.
#   install-all          Install all types and build.
#   install-types        Install types.
#   install-build        Install build.
#   install              Install types and build.
#   format               Format the project.
#   check-all-formatting Check all formatting.
#   check-all-styles     Check all styles.
#   check-all-tests      Check all tests.
#   check-all            Check all formatting, styles, and tests.
#   check-formatting     Check formatting.
#   check-styles         Check styles.
#   check-test           Check tests.
#   check                Check formatting, styles, and tests.
#   all                  Initialize, install all types and build, and check all
#                        formatting, styles, and tests.
#   changes              Initialize, install, and check formatting, styles, and
#                        tests for changes only.
#   module               Create a new module.
#   clean                Clean the project.
#
################################################################################

# Set the default target "all".
.DEFAULT_GOAL:=all

# "all" is a well-known make target.
all: initialize install-all check-all

.PHONY: changes
changes: initialize install check

.PHONY: initialize
initialize:
	@echo "Initializing..." \
	&& yarn install --immutable \
	&& echo "Successfully initialized."

.PHONY: init
init: initialize

.PHONY: install-all-types
install-all-types:
	@echo "Installing types..." \
	&& echo "This may take several seconds without logging output..." \
	&& yarn tsc:full \
	&& echo "Successfully installed types."

.PHONY: install-all-builds
install-all-builds:
	@echo "Installing build..." \
	&& yarn build:all \
	&& echo "Successfully installed build."

.PHONY: install-all
install-all: install-all-types install-all-builds
	@echo "Successfully installed."

.PHONY: install-types
install-types:
	@echo "Installing types..." \
	&& echo "This may take several seconds without logging output..." \
	&& yarn tsc \
	&& echo "Successfully installed types."

.PHONY: install-build
install-build: install-all-builds

.PHONY: install
install: install-types install-build
	@echo "Successfully installed."

.PHONY: format
format:
	@echo "Formatting..." \
	&& echo "This may take some time..." \
	&& yarn prettier:fix \
	&& echo "Successfully formatted."

.PHONY: check-all-formatting
check-all-formatting:
	@echo "Checking formatting..." \
	&& echo "This may take some time..." \
	&& yarn prettier:check \
	&& echo "Successfully checked formatting."

.PHONY: check-all-styles
check-all-styles:
	@echo "Checking styles..." \
	&& yarn lint:all \
	&& echo "Successfully checked styles."

.PHONY: check-all-tests
check-all-tests:
	@echo "Checking tests..." \
	&& echo "This may take several minutes..." \
	&& yarn test:all \
	&& echo "Successfully checked tests."

.PHONY: check-all
check-all: check-all-formatting check-all-styles check-all-tests
	@echo "Successfully checked."

.PHONY: check-formatting
check-formatting:
	@echo "Checking formatting..." \
	&& echo "This may take some time..." \
	&& yarn prettier:check \
	&& echo "Successfully checked formatting."

.PHONY: check-styles
check-styles:
	@echo "Checking styles..." \
	&& yarn lint \
	&& echo "Successfully checked styles."

.PHONY: check-test
check-test:
	@echo "Checking tests..." \
	&& echo "This may take several minutes..." \
	&& yarn test -- --watch=false \
	&& echo "Successfully checked tests."

.PHONY: check
check: check-formatting check-styles check-test
	@echo "Successfully checked."

.PHONY: module
module:
	@echo "Creating module..." \
	&& yarn new \
	&& echo "Successfully created module."

.PHONY: clean
clean:
	@echo "Cleaning..." \
	&& yarn clean \
	&& echo "Successfully cleaned."
