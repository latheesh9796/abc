import React, { Component } from "react";
import "../css/Hashtag.css";

class Hashtag extends Component {
  state = {
    hashtagsLeft: [
      "#DonaldTrump",
      "#Politics",
      "#Environment",
      "#Comedy",
      "#2019Elections"
    ],
    hashtagsRight: ["#Santhanam", "#AOne", "#Bhaskar", "#Samsung", "#Mobile"]
  };
  render() {
    return (
      <div className="Hashtag">
        <h4>Trending Hashtags</h4>
        {this.state.hashtagsLeft.map(hashtag => (
          <p>{hashtag}</p>
        ))}
      </div>
    );
  }
}

export default Hashtag;
