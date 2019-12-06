import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import TweetCard from "./components/TweetCard";
import Hashtag from "./components/Hashtag";
import SearchButton from "./components/SearchButton";

// ReactDOM.render(<TweetCard />, document.getElementById("root"));
//ReactDOM.render(<Hashtag />, document.getElementById("hashtag"));
ReactDOM.render(<SearchButton />, document.getElementById("nav"));

serviceWorker.unregister();
