import React, { Component } from "react";
import "../css/TweetCard.css";
import Moment from "react-moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

class TweetCard extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <div className={"card " + this.props.tweet.sentiment}>
          <div className="row">
            <div className="column-60">
              <div className="username-line">
                <h4>
                  <span>{this.props.tweet.fullName}</span>
                  <p>(@{this.props.tweet.twitterName})</p>{" "}
                </h4>
              </div>
              <p>{this.props.tweet.tweetText}</p>
            </div>
          </div>
          <div className="sameLine">
            <div className="leftImage">
              <span>
                <FontAwesomeIcon icon={faRetweet} />
                &nbsp;{this.props.tweet.retweets}&nbsp;&nbsp;&nbsp;&nbsp;
                <FontAwesomeIcon icon={faHeart} color="red" />
                &nbsp;{this.props.tweet.favorites}
              </span>
            </div>
            <p class="buttonStyle">
              <Moment format="DD MMMM YY">{this.props.tweet.created_at}</Moment>
            </p>
          </div>
          <div></div>
        </div>
      </div>
    );
  }
}
export default TweetCard;
