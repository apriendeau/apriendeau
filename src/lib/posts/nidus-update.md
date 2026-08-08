---
title: "Nidus: evolution was necessary"
date: "2026-08-07"
tags: ["vector", "database", "development", "ai", "search", "wdpkr", "duckedup", "vibe-coding", "lancedb"]
---

After some time of working and playing with Nidus, I realized that I needed to pivot what it did which meant
adding a lot of things I was avoiding. Nidus needed to be more than a vector search engine. It needed to be a
memory storage for our agents, a way to recall things quickly, so we needed to add features and support things
that I didn't intend to add. I am the first to admit that I was wrong with what I thought it was going to be.

## ALL THE THINGS

I found that I needed embedding, so Nidus added a built-in embedder and you can choose the provider that you want,
including a local instance of Ollama. This naturally led to other features like [recall](https://nidus.duckedup.org/guides/remember-and-recall/).

After using it in real life, I needed to add several search types for different use cases. That meant ANN and Full-Text support as well as the Hybrid of the two. Pagination, Scoring, Scoping are all things that we needed.

Instead of creating a new database to support in production, Tyler and I decided that it was wiser to trust the
existing tools for in-memory and cold storage. So now Nidus can run in the cloud using Redis, Valkey, and S3-compatible
software.

As much as I don't like MCP, it's here and it needed support because Claude really likes its MCP servers, so Nidus now has
MCP 2 support for Claude to plug into and has Docker support with cluster mode for high availability.

Everything is still fast and written in Rust because I can. You gave me AI, I get to do what I want. Deal with it.

## I am having fun

Since I am not getting my dopamine hits from coding anymore, I have to find it somewhere, and it's coming from here.
Something I enjoy. Will anyone use it? Don't know. Don't care. I am gonna keep doing this while I enjoy it and if
someone wants to use it, I hope they do.
