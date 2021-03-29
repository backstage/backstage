docker_tag                  := backstage-make
docker_name_prefix          := backstage-make
frontend_port               := 3000
frontend_host_port          := 3000
backend_port                := 7000
backend_host_port           := 7000

now_date_time_tag            = `date +'%Y%m%d%H%M%S'`
my_dir_path                  = $(dir $(CURDIR)/$(firstword $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST)))
project_root_dir_path        = $(my_dir_path)/../../
docker_name_timestamp_prefix = $(docker_name_prefix)-$(now_date_time_tag)

.PHONY: container
container:
	@docker build \
		-t $(docker_tag) \
		-f ./Dockerfile \
		.

.PHONY: rm-container
rm-container:
	@docker rmi -f $(docker_tag)

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

.PHONY: tsc
tsc:
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn tsc

.PHONY: build
build:
	@docker run --rm -it \
		--name $(docker_name_timestamp_prefix)-$@ \
		--network host \
		-v $(project_root_dir_path):/app \
		-w /app \
		--entrypoint "" \
		$(docker_tag) \
		yarn build

# BUG: the frontend seems to run on "$(backend_port)" (7000 default).
#      The documentation states "This is going to start two things, 
#      the frontend (:3000) and the backend (:7000)."
#      However, the frontend seems to end up running on 7000.
.PHONY: dev
dev:
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

# dev alias
.PHONY: start
start: dev

# dev alias
.PHONY: run
run: dev
