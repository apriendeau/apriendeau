default: help

# display this help
help:
    @just --list

# build the site with no server
build:
    hugo --config="config.toml"

# create a new post: just post my-slug
post slug:
    hugo new posts/{{slug}}.md

# run local server on :1313 with drafts
server *args:
    hugo {{args}} server -D --config="config.toml"

# same as server but disables fast rendering
rebuild-server *args:
    hugo {{args}} server --disableFastRender -D --config="config.toml"

# alias for server
serve *args: (server args)

# create a new static page: just static my-slug
static slug:
    hugo new static/{{slug}}.md
