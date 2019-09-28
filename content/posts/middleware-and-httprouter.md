---
title: "Middleware and Httprouter"
date: 2019-09-28T11:55:42-06:00
draft: true
toc: false
images:
tags:
  - go
  - golang
---
**Updated 12/2/2016 - I have added an example of how to achieve this with Go 1.7&rsquo;s `cocontext/context` package.**

I really love [HTTPRouter](https://github.com/julienschmidt/httprouter) over using other frameworks but there
was a problem. It doesn&rsquo;t meet &ldquo;net/http&rdquo; Handler interface because it adds the params to function. That is
fine except when you need to attach other middleware to your application which I guarantee that you will have to.
For reference, this is what I am referring to.

```go
func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    fmt.Fprint(w, "Welcome!")
}
```

So how do we fix this? It&rsquo;s quite simple. Every app that I write usually has some kind context middleware
so let&rsquo;s add a layer to fix this and store the information in there. I use a this
[context](https://github.com/apriendeau/context/blob/master/context.go) for my context needs but modify
the struct for each project because personally I do not like  type-casting everywhere but for simplicity sake,
let's use [gorilla/context](https://github.com/gorilla/context). I also suggest using
[alice](https://github.com/justinas/alice) for chaining middleware otherwise it gets nasty quick.

So lets start by showing the first function which takes the HTTPRouter request
handler and then makes it compatible with `net/http`.

```go
// Essentially we are just taking the params and shoving them
// into the context and returning a proper httprouter.Handle.
func wrapHandler(h http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request,
		ps httprouter.Params) {
		ctx := context.Get(r)
		ctx.Set(r, "params", ps)
		h.ServeHTTP(w, r)
	}
}
```

So you need to add one more function to wrap this all together with the middleware using alice but this is
more for aesthetic and readability for  when you place the code in the router so it can look like
it did before and not so nasty.
```go
func basic(p string, h func(http.ResponseWriter, *http.Request)) (string, httprouter.Handle) {
	return p, wrapHandler(alice.New(context.ClearHandle).ThenFunc(h))
}
// this is so you can do this:
router.GET(basic("/people/:id";, handler))
```

or if you want the nasty version, you can do this everywhere.

```go
router.GET("/people/:id", wrapHandler(alice.New(context.ClearHandle).ThenFunc(handler)))

```

Your choice. So lets put it all together in an example web server using the nice way:
```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/context"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func main() {
	router := httprouter.New()
	router.GET(basic("/people/:id", handler))
	log.Panic(http.ListenAndServe(":8000", http.Handler(router)))
}

func basic(p string, h func(http.ResponseWriter, *http.Request)) (string, httprouter.Handle) {
	return p, wrapHandler(alice.New(context.ClearHandler).ThenFunc(h))
}

func wrapHandler(h http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		context.Set(r, "params", ps)
		h.ServeHTTP(w, r)
	}
}

func handler(w http.ResponseWriter, r *http.Request) {
	var params httprouter.Params
	if ps := context.Get(r, "params"); ps != nil {
		params = ps.(httprouter.Params) // this is part I hate about gorilla
	}
	w.WriteHeader(200)
	fmt.Fprintf(w, fmt.Sprintf("Welcome %s", params.ByName("id")))
}
```

So its a bit of work to set it up but it works amazing once you do because then you are not restricted to a framework.

I tend to use this style of web with <a href="https://github.com/apriendeau/shttp">shttp</a> for most of my go apps because yes,
some my call it a &ldquo;custom&rdquo; framework but to me, its more of a style than framework. You still have all the flexibility
of Go.

## Using `context/context`

So I wanted to add an example of using this with Go 1.7&rsquo;s context package rather then using gorilla&rsquo;s context. Now,
Go has a context built into `net/http.Request` which removes the need for external context packages. It does most of
the heavy lifting for you. So I wanted to post an example of how to use it with httprouter since I still prefer that
as my default router.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func main() {
	router := httprouter.New()
	router.GET(wrap("/:id", handler))
	log.Panic(http.ListenAndServe(":8080", http.Handler(router)))
}

func wrap(p string, h func(http.ResponseWriter, *http.Request)) (string, httprouter.Handle) {
	return p, wrapHandler(alice.New().ThenFunc(h))
}

func wrapHandler(h http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", ps)
		r = r.WithContext(ctx)
		h.ServeHTTP(w, r)
	}
}

func FetchParams(req *http.Request) httprouter.Params {
	ctx := req.Context()
	return ctx.Value("params").(httprouter.Params)
}

func handler(w http.ResponseWriter, r *http.Request) {
	params := FetchParams(r)
	fmt.Fprintf(w, "Hi there, I love %s!", params.ByName("id"))
}
```
