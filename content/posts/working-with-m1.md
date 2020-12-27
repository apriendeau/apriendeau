---
title: "My journey with an M1 and Emacs"
date: 2020-12-26T20:45:10-07:00
draft: false

tags: ["development", "apple", "m1", "emacs", "homebrew"]
---

TLDR; Things are coming together but just wait if you want to use this type of macbook in a Professional development capicity.

*Note: At the time of writing this, Docker was not supported and both Rust and Go would not compile on M1 and were in beta versions.

I had not upgraded my existing macbook in 8 years and Apple finally decided to cut me off from OS upgrades. So naturally, I grabbed an Apple M1 Macbook Air without thinking much.
The first thing that I did was attempt to install Homebrew. Well that was a nightmare. There was not any good documentation on how to do it, so I am going to let you know how I
got both systems up

So let's get to work, the way for me to get around it without much diving in, was clone the repo into `/opt/homebrew` with one terminal running in M1 and a copy running in Rosetta, I installed Homebrew the usual way. I then added to my .zshrv the following lines:

```shell
rosetta=$(sysctl -n sysctl.proc_translated)

if [ $rosetta -eq 0 ];
then
    echo ">>> CPU_ARCH: m1"
    export PATH=/opt/homebrew/bin:$PATH
else
    echo ">>> CPU_ARCH: rosetta2"
    export PATH=/usr/local/lib/ruby/gems/2.7.0/bin:$PATH
    export PATH=/usr/local/bin:/usr/local/opt/ruby/bin:/bin:/usr/bin:$PATH
fi
```

This allowed me to tell what kind of terminal that I was running in. Rosetta2 mostly works with a few hiccups with C so I have been attempting to use the M1 and edit brew files as I go.
I next needed emacs (if you are a vim user, it works outside of the box) and I use [d12frosted/emacs-plus](https://github.com/d12frosted/homebrew-emacs-plus). When attempting to install,
I would run into an error compiling Rust.* I preceded to use emacs in Rosetta mode which lasted about 2 weeks before they patched emacs for ARM. This was great news but now blocked me
from using Rosetta, because it knew I was on an ARM processor and jumping straight to using that patch. This was great news and bad news because Homebrew still didn't support Rust. After
doing some debugging, I figured out that `librsvg` was where the Rust dependency was being required from. I immediately changed this line in the formula from:

```ruby
	depends_on "librsvg"
```

to:

```ruby
	depends_on "librsvg" => :recommended
```

This gave me emacs again! Yay, I could code like I am normally do. Everything installed with Straight and started writing this. After posting a PR for my patch and a day later, homebrew updated
patches for Rust and Go on Christmas. So the moral of this Christmas tale is that I guess I should have been more patient but now I am just happy to have emacs working on the M1 and
not using Rosetta as it is a far better and smoother experience.


If patience was one of my virtues, I wouldn't be a developer. 😆
