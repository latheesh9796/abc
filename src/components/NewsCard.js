import React, { Component } from "react";
import "../css/NewsCard.css";
class NewsCard extends Component {
  constructor(props) {
    super(props);
  }

  openUrl = url => {};

  state = {};
  render() {
    return (
      <div className="card">
        <h2 className="padding-10">{this.props.article.title}</h2>
        <hr></hr>
        <p>{this.props.article.description}</p>
        <a className="linkStyle" href={this.props.article.url} target="_blank">
          View Link
        </a>
      </div>
    );
  }
}

export default NewsCard;
