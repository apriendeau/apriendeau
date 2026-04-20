---
title: "Mono Repos with gRPC"
date: 2026-04-19T23:08:41-06:00
draft: true

tags: ["development", "rust", "go", "bun", "monorepo", "mono", "repo", "grpc"]
---

Over there years, I have worked with several different git setups but when finally given the choice, I always go back to a mono repo setup because switching back and forth just to make a change is exhausting for my brain. People have come to me and ask how do I set it up. I will say that my way is probably has its flaws but it has worked pretty well for me when working with several services. 

Why does this even matter if we all are vibecoding anyways? I will die on this argument and hill. Before you vibe anything out or even code by hand, a good structure is key to everything. Its your foundation and having simple, repeatable structure will save you time and tokens when building.

I am going to lay this out with the tools that are my preferred three: rust, go and bun. Why is this important, because when it comes to your mono repo, you should base it around tools you are going to be working with and it should be flexible. 

## Directory Layout

Lets assume grpc-app1 is a rust grpc service and grpc-app2 is a go grpc service because in the real world we have both. The webapp is some server-side javascript framework flavor of the week (bonus thought: personally really liking sveltekit.) Lastly, the api is some graphql api in bun or go.

```
- {cool project name}
  - .devcontainer
  - .github
  - build
  - platform
  - scripts
  - src
    - config
    - grpc-app1
    - grpc-app2 
    - migrations
    - pb
    - public-api
    - webapp
    - shared-lib
  - Cargo.toml
  - go.mod
  - package.json
  - justfile
  - CLAUDE.md
  - dockerfile-compose.yml
```

### High level overview:

If you are familiar with Linux, it's pretty straight forward. The reason
is cognitive overload. It's real, and as an autistic person I experience
it more than I'd like to admit. So matching the Linux layout where I can
saves me cycles when I have to go find where the bot went wrong. 

I will break down some of the individual folders:

```
.devcontainer/ — devcontainer config
.github/       — GitHub config (workflows, templates, codeowners)
build/         — Dockerfiles
platform/      — ops and infra
scripts/       — justfiles
src/           — programs and shared libraries
```
