---
title: "Nidus: A Spite-Driven Vector Search for Development"
date: "2026-06-09"
tags: ["vector", "database", "development", "ai", "search", "wdpkr", "duckedup", "vibe-coding", "lancedb"]
---

A while back, Tyler Lugger and I discussed vector searching, and he implemented Turbopuffer into our stack because I like to believe we both share a mutual hatred of running Java in production. He probably has a more elegant way of phrasing it, but that's my version. I am always skeptical of developers depending on cloud products and not being able to run everything off their laptop; outages are real, but I buried that thought and moved on.

Then along came [wdpkr](https://wdpkr.duckedup.org/).

This thought experiment of Tyler's proved valuable, and it has saved us tokens and time. For the proof of concept, he chose Turbopuffer because of our success with it, but that headache reared its head again for me. I wanted to run it locally to test and develop, and it raised the barrier to entry for people.

We had two goals when we talked about it.

1. It had to be fast.
2. It needed to be embedded in the program.

## The Detours

With those two goals in mind, I went looking for an engine that fit. Say what you want about "vibe-coding" (it has its pits and peaks), but one thing it let me do was experiment with local vector search engines quickly. While this was painful and full of headaches, doing it any other way would have been a much bigger headache. I am going to explain my reasoning, and none of the engines we tried are bad. In fact, quite the opposite: they are great. They are just aiming to do different things.

### LanceDB

I started with `lancedb`, thinking it might be an easy win with Rust. Well, the more I dove in, the more I found that it was heavy and filled with features that, frankly, we didn't care about. It increased our compile time from 30s to 27min. This was due to a bunch of dependencies under the hood that forced `FFI` calls and `C` compilation. I realized that when I saw the compile times, and ripped it out.

### DuckDB

So onwards to the next one: DuckDB. The name just fit our theming here. It was also a lighter-weight search than LanceDB, but it was still in C and needed FFI. It dropped the compile time back down, but it was still 10min. I learned a lot about caching builds, but I still wasn't happy. I actually shipped DuckDB into wdpkr for about a week, and then, as I kept coding, the compile times caught up with me. We could have shipped it in a way where the user had to install it as a dependency, but that made it more difficult for people to get started.

### SQLite with sqlite-vec

This was the next logical step, but I stopped here. SQLite was yet another C library I'd have to compile in and reach through FFI to use, and by that point I was over it.

## Enter nidus

By this point the frustration had been building for weeks. Every option was the same story: another C library, another FFI boundary, another compile time creeping back up. I was tired of bending our build around someone else's dependencies just to get a vector search that ran locally. That frustration is what spawned nidus.

After thinking about it more and more, I adopted the mindset that everything is going to go bespoke sooner or later. After several discussions with the duckedup crew, I drew some conclusions about what I wanted. We needed a Rust version that was light and fast. I did not want it to be a "production" grade system. I wasn't looking to reinvent the wheel. I wanted it to be easy, and something that would fit on a Mac mini that we could ship with wdpkr so that people who wanted a simple vector search could use it.

So after all of that, the MVP requirements became clear:

1. Brute-force for memory safety.
2. Developer friendly, fast compile times.
3. No C or FFI.
4. File storage.
5. No Async, for now.
6. Embeddable.

After a night of designing and laying out the specs, I built the nest, or [nidus](https://nidus.duckedup.org/), which is Latin for nest. Everything I am going to lay out is subject to change because we are experimenting with these decisions, and if they turn out to be wrong, I will update this. With it, our compile times came back under a minute, one step closer to our goal of running everything locally.

Why "no async"? Since this was going to be embedded, I wanted the program embedding it to have that control. So now, that program can use it in async calls to its heart's content with no issues.

None of this makes nidus special on paper. It's brute-force, single-threaded, and deliberately boring. But it compiles in under a minute, runs off a laptop, and ships inside wdpkr with zero setup. And after the LanceDB and DuckDB detours, boring is exactly what I wanted.
