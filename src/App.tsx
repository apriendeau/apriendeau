import React from "react";
import Home from "./components/home";
import About from "./components/about";
import "./App.scss";
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="pure-g">
        {/* <header className="header pure-u-1">
            <h1>Austin Riendeau</h1>
            </header> */}

        {/* <nav className="sidebar-nav pure-u-1">
            <div>
            <ul>
            <li>
            <Link to="/">home</Link>
            </li>
            <li>
            <Link to="/about">about</Link>
            </li>
            </ul>
            </div>
            </nav>
	  */}
        <main className="pure-u-1">
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/" component={Home} />
          </Switch>
        </main>
        {/* <footer className="pure-u-1"></footer>*/}
      </div>
    </Router>
  );
}
