import React from "react";
import Home from "./components/home";
import About from "./components/about";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="container">
        <header className="header row">
          <div className="column column-50 column-offset-33 header-text">
            <h1>Austin Riendeau</h1>
          </div>
        </header>

        <nav className="sidebar-nav row">
          <div className="mobile-nav column column-33 column-offset-33">
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

        <main className="row">
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/" component={Home} />
          </Switch>
        </main>
        <footer className="row"></footer>
      </div>
    </Router>
  );
}
