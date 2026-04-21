---
title: "Mono Repos with gRPC"
date: 2026-04-19T23:08:41-06:00
draft: false

tags: ["development", "rust", "go", "bun", "monorepo", "mono", "repo", "grpc"]
---

Over the years, I have worked with several different git setups but when finally given the choice, 
I always go back to a mono repo setup because switching back and forth just to make a change is 
exhausting for my brain. People ask me how I set it up. I will say that my way probably has its 
flaws but it has worked pretty well for me when working with several services.

Why does this even matter if we're all vibecoding anyway? I will die on this hill. 
Before you vibe anything out or even code by hand, a good structure is key to everything. It's your 
foundation and having simple, repeatable structure will save you time and tokens when building. 
This is what you should take away from this rant. Architecture is everything and this is the 
foundation.

I am going to lay this out with the tools that are my preferred three: Rust, Go, and Bun. 
Why is this important? Because when it comes to your mono repo, you should base it around 
tools you are going to be working with and it should be flexible.

I am going to just show some of the tricks I use but this is not gospel and you should not die by
this. Every project has its own structure and layout to solve the problem that you are trying to
solve or service that you are trying to create.

## Directory Layout

Let's assume app1 is a Rust gRPC service and app2 is a Go gRPC service because in the real world we 
have both. The webapp is some server-side JavaScript framework flavor of the week (bonus thought: personally really liking SvelteKit). Lastly, the api is some GraphQL API in Bun or Go.

```
- {cool project name}
  - .claude/
  - .devcontainer/
  - .github/
  - build/
  - cmd/
  - platform/
  - scripts/
  - src/
    - config/
    - app1/
    - app2/
    - migrations/
    - pb/
      - app1pb/
        - app1.proto
      - app2pb/
        - app2.proto
    - public-api/
    - shared-lib/
    - webapp/
  - Cargo.toml
  - go.mod
  - package.json
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
cmd/           — entry points for each service
platform/      — ops and infrastructure
scripts/       — justfiles or makefiles live here
src/           — programs and shared libraries
```

## Workspace Magic

One architectural decision that I have made with languages is that they need to support
a workspace-like feature. This is important to making this work. In the use case above,
we use Rust workspaces and Bun workspaces but not Go.

For Bun, workspaces let us share a single bun.lock, deduplicate dependencies, and symlink 
local packages so shared libraries can be used without publishing to a registry.

For Rust, each has its own Cargo.toml. The workspace gives them a shared Cargo.lock, 
unified build commands, and path-based use of shared crates like config, db, and logging.

For Go, this functionality is the norm. Go workspaces would cause the opposite effect. 
Go workspaces exist specifically for repos with multiple go.mod files that need to reference
each other during local development. A go.work would be redundant.

## One Ring to Rule Them All

What does this mean? Well, in this case, one directory can have multiple languages in it. 
I am sure I am breaking some old-school cardinal rule somewhere with this but I actually 
believe this makes the most logical sense.

Let's take a config directory. We have our three chosen languages here living side by side,
harmoniously. How, you ask? Well, Go and JavaScript can be in any directory, while Rust needs 
to live under a `src` directory. Then they import the path they need. Simple as that.

## Shared Protobuf directory

Why a shared protobuf directory? Well, a couple of reasons, but mainly import cycles. If each 
service kept its proto-generated code inside its own directory (e.g., `src/app1/pb/`), 
you'd create circular import problems — service A imports service B's package just to get
the proto types, but that pulls in B's entire module.

For example, your public API is going to need to use the gRPC services, so having a shared
directory of the generated types is a perfect use case for the shared directory.


## Recap

Take everything with a grain of salt. Maybe these tricks will save you some headaches, maybe
they will create some, but please, take the time to set this up correctly and make sure it 
will scale with you.
