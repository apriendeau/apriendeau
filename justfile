default: help

# display this help
help:
    @just --list

# install dependencies
install:
    bun install

# run local dev server
dev:
    bun run dev

# build static site
build:
    bun run build

# preview production build
preview:
    bun run preview

# type-check
check:
    bun run check

# create a new post: just post my-slug
post slug:
    @echo '---' > src/lib/posts/{{slug}}.md
    @echo 'title: "{{slug}}"' >> src/lib/posts/{{slug}}.md
    @echo 'date: "'$(date +%Y-%m-%d)'"' >> src/lib/posts/{{slug}}.md
    @echo 'tags: []' >> src/lib/posts/{{slug}}.md
    @echo '---' >> src/lib/posts/{{slug}}.md
    @echo '' >> src/lib/posts/{{slug}}.md
    @echo "Created src/lib/posts/{{slug}}.md"
