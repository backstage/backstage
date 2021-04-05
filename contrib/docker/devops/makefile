# tag for the local docker image
docker_tag := backstage-make

# prefix for running docker containers
# this helps to quickly identify containers by name
docker_name_prefix := backstage-make

# post mappings from internal docker containers
# to the host computer
frontend_port      := 3000
frontend_host_port := 3000
backend_port       := 7000
backend_host_port  := 7000

# path to this "makefile"
my_dir_path = $(dir $(CURDIR)/$(firstword $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST)))

# the relative root of the project
project_root_dir_path = $(my_dir_path)/../../../

# dynamic tag to uniquely identify when the script was run
# e.g. running docker images are tagged with this
now_date_time_tag = `date +'%Y%m%d%H%M%S'`

# prefix the name of docker containers
# for easy identification
docker_name_timestamp_prefix = $(docker_name_prefix)-$(now_date_time_tag)

# `make` will execute this
.DEFAULT_GOAL:=all

# the projects end-to-end tasks execute the build prior to the tests
.PHONY: all
all: build check

# build the docker container image
.PHONY: container
container:
	@docker build \
		-t $(docker_tag) \
		-f ./Dockerfile \
		.

# remove the docker container image from local
.PHONY: rm-container
rm-container:
	@docker rmi -f $(docker_tag)

# creates an interactive container session
.PHONY: interactive
interactive: container
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "/bin/ash" \
		$(docker_tag)

# clean the project
.PHONY: clean
clean: container
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		rm -rf node_modules

# install dependencies
.PHONY: install
install: container
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn install

.PHONY: build-typescript
build-typescript: install
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn tsc

# build the project
.PHONY: build
build: build-typescript
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn build

# auto-format a document properly
.PHONY: format-doc
format-doc: install
ifndef path
	$(error Missing required "path" argument)
endif
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn prettier --write $(path)

# verify document formatting
.PHONY: check-docs
check-docs: install
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn run lint:docs

# analyze the code
.PHONY: check-code
check-code: install
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn run lint:all

.PHONY: check-type-dependencies
check-type-dependencies: install
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn run lint:type-deps

# check is a standard target for make
# so, prefixing with "check-"
.PHONY: check-styles
check-styles: install
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn run prettier:check

# execute all tests
# BUG: failing tests
# https://github.com/backstage/backstage/issues/5212
.PHONY: check-tests
check-tests: build
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn run test:all

# convenience: dev alias
.PHONY: test
test: check-tests

# check all the things
# BUG: check-tests failing (see target comments)
.PHONY: check
check: check-code check-docs check-type-dependencies check-styles

# run development instance
# BUG: the frontend seems to run on "$(backend_port)" (7000 default).
#      The documentation states "This is going to start two things, 
#      the frontend (:3000) and the backend (:7000)."
#      However, the frontend seems to end up running on 7000.
.PHONY: dev
dev: build
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		-p $(frontend_port):$(frontend_host_port) \
		-p $(backend_port):$(backend_host_port) \
		--env PORT=$(frontend_port) \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn dev

# convenience: dev alias
.PHONY: start
start: dev

# convenience: dev alias
.PHONY: run
run: dev
