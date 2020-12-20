.PHONY: build post server static sass help
.DEFAULT_GOAL := help

build: ## Default building of site with no server
	hugo --config="config.toml"

post: ## create a new post
	hugo new post/${args}.md

server: ## create a localserver to run on localhost:1313
	hugo ${args} server -D --config="config.toml"

rebuild-server: ## same as server but disables fast rendering
	hugo ${args} server --disableFastRender -D --config="config.toml"

serve: server ## alias for server

static: ## create a new static page
	hugo new static/${args}.md

help: ## display this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

