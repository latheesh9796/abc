import React, { Component } from "react";
import "../css/SearchButton.css";
import "../styles/w3.css";
import TweetCard from "./TweetCard";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Highcharts from "highcharts";
import PieChart from "highcharts-react-official";
import loaderimage from "../walkingdude.gif";
import ceetload from "../ceetload.png";
import { SegmentedControl } from "segmented-control";
import NewsCard from "./NewsCard";
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2)
    }
  }
}));

function CircularDeterminate() {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function tick() {
      // reset when reaching 100%
      setProgress(oldProgress => (oldProgress >= 100 ? 0 : oldProgress + 1));
    }

    const timer = setInterval(tick, 20);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <CircularProgress variant="determinate" value={progress} />
      <CircularProgress
        variant="determinate"
        value={progress}
        color="secondary"
      />
    </div>
  );
}

class SearchButton extends React.Component {
  constructor() {
    super();
    this.addToList = this.addToList.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.state = {
      initialSearch: false,
      segmentedControl: "Tweets",
      start: 0,
      numFound: 0,
      searchQuery: "",
      condition: "",
      baseUrl: "http://18.191.81.187:8983/solr/IRFINAL/select?q=",
      searchUrl: "",
      results: 0,
      tweets: [],
      news: [],
      loading: false,

      language: {
        english: false,
        hindi: false,
        portuguese: false
      },
      country: {
        india: false,
        usa: false,
        brazil: false
      },
      sentiment: {
        positive: false,
        negative: false,
        neutral: false
      },
      negative: 0,
      positive: 0,
      lang_hi: 0,
      lang_en: 0,
      lang_pt: 0,
      neutral: 0,
      country_in: 0,
      country_br: 0,
      country_us: 0,
      analyticsIndex: 0
    };
  }

  resetCondition = () => {
    if (this.state.searchQuery) {
      var finalCondition = "text :" + this.state.searchQuery;
      var countryCount = 0;
      var languageCount = 0;
      var sentimentsCount = 0;
      var countryCondition = "";
      var languageCondition = "";
      var sentimentCondition = "";
      var countries = [];
      var sentiments = [];
      var languages = [];
      if (this.state.language.hindi) {
        languageCount = languageCount + 1;
        languages.push("hi");
      }
      if (this.state.language.english) {
        languageCount = languageCount + 1;
        languages.push("en");
      }
      if (this.state.language.portuguese) {
        languageCount = languageCount + 1;
        languages.push("pt");
      }

      if (this.state.sentiment.positive) {
        sentimentsCount = sentimentsCount + 1;
        sentiments.push("positive");
      }
      if (this.state.sentiment.neutral) {
        sentimentsCount = sentimentsCount + 1;
        sentiments.push("neutral");
      }
      if (this.state.sentiment.negative) {
        sentimentsCount = sentimentsCount + 1;
        sentiments.push("negative");
      }

      if (this.state.country.india) {
        countryCount = countryCount + 1;

        console.log("I am in INDIA");
        countries.push("India");
      }
      if (this.state.country.usa) {
        console.log("I am in USA");
        countryCount = countryCount + 1;
        countries.push("USA");
      }
      if (this.state.country.brazil) {
        console.log("I am in BRAZIL");
        countryCount = countryCount + 1;
        countries.push("Brazil");
      }
      var condition = "text:" + this.state.searchQuery;
      if (countryCount > 0) {
        if (countryCount === 1) {
          countryCondition = "country: " + countries[0];
        } else {
          for (var i = 0; i < countries.length; i++) {
            if (i === 0) {
              countryCondition = "country: " + countries[0];
            } else {
              countryCondition =
                countryCondition + " OR country: " + countries[i];
            }
          }
        }
      }
      if (sentimentsCount > 0) {
        if (sentimentsCount === 1) {
          sentimentCondition = "sentiment: " + sentiments[0];
        } else {
          for (var i = 0; i < sentiments.length; i++) {
            if (i === 0) {
              sentimentCondition = "sentiment: " + sentiments[0];
            } else {
              sentimentCondition =
                sentimentCondition + " OR sentiment: " + sentiments[i];
            }
          }
        }
      }
      if (languageCount > 0) {
        if (languageCount === 1) {
          languageCondition = "tweet_lang: " + languages[0];
        } else {
          for (var i = 0; i < languages.length; i++) {
            if (i === 0) {
              languageCondition = "tweet_lang: " + languages[0];
            } else {
              languageCondition =
                languageCondition + " OR tweet_lang: " + languages[i];
            }
          }
        }
      }
      if (countryCondition) {
        finalCondition = finalCondition + " AND (" + countryCondition + ")";
      }
      if (sentimentCondition) {
        finalCondition = finalCondition + " AND (" + sentimentCondition + ")";
      }
      if (languageCondition) {
        finalCondition = finalCondition + " AND (" + languageCondition + ")";
      }
      console.log("BEFORE SET STATE - ", finalCondition);
      this.setState(
        {
          condition: finalCondition,
          searchUrl:
            this.state.baseUrl +
            encodeURIComponent(finalCondition) +
            "&rows=15&start=" +
            this.state.start,
          loading: true
        },
        console.log(
          this.state.baseUrl +
            encodeURIComponent(finalCondition) +
            "&rows=15&start=" +
            this.state.start,
          "RESET CONDITION"
        ),
        fetch(
          this.state.baseUrl +
            encodeURIComponent(finalCondition) +
            "&rows=15&start=" +
            this.state.start
        )
          .then(results => {
            return results.json();
          })
          .then(data => {
            var numFound = data.response.numFound;
            this.setState({
              numFound: numFound,
              loading: false
            });
            var dataResponse = data.response.docs.map(x => this.addToList(x));
            console.log(this.state.searchUrl);
            console.log("Found ", dataResponse);
          })
      );
    }
  };

  addToList = x => {
    try {
      console.log("TRY DATA", x);
      var country = x["country"][0];
      var imageUrl = x["user.profile_image_url"][0];
      var tweetId = x["id"][0];
      var tweetText = x["formatted_text"][0];
      var twitterName = x["poi_name"][1];
      var fullName = x["user.name"][0];
      var sentiment = x["sentiment"][0];
      var created_at = x["created_at"][0];
      var tweetLang = x["tweet_lang"][0];
      var favorites = x["favorite_count"][0];
      var retweets = x["retweet_count"][0];
      var verified = x["user.verified"][0];
      if (country == "Brazil") {
        this.state.country_br += 1;
        this.setState({ country_br: this.state.country_br + 1 });
      } else if (country == "India") {
        this.state.country_in += 1;
        this.setState({ country_in: this.state.country_in + 1 });
      } else {
        this.state.country_us += 1;
        this.setState({ country_us: this.state.country_us + 1 });
      }
      if (sentiment == "negative") {
        this.state.negative += 1;
        this.setState({ negative: this.state.negative + 1 });
      } else if (sentiment == "positive") {
        this.state.positive += 1;
        this.setState({ positive: this.state.positive + 1 });
      } else {
        this.state.neutral += 1;
        this.setState({ neutral: this.state.neutral + 1 });
      }
      if (tweetLang == "en") {
        this.state.lang_en += 1;
        this.setState({ lang_en: this.state.lang_en + 1 });
      } else if (tweetLang == "pt") {
        this.state.lang_pt += 1;
        this.setState({ lang_pt: this.state.lang_pt + 1 });
      } else {
        this.state.lang_hi += 1;
        this.setState({ lang_hi: this.state.lang_hi + 1 });
      }
      const tweet = {
        tweetId: tweetId,
        fullName: fullName,
        twitterName: twitterName,
        tweetText: tweetText,
        sentiment: sentiment,
        created_at: created_at,
        imageUrl: imageUrl,
        favorites: favorites,
        retweets: retweets,
        verified: verified
      };
      let tweets = this.state.tweets;
      tweets.push(tweet);
      this.setState({
        tweets: tweets
      });
    } catch (e) {
      console.log("CATCH :", e);
      console.log("DATA", x);
      var imageUrl = x["user.profile_image_url"][0];
      var tweetId = x["id"][0];
      var tweetText = x["formatted_text"][0];
      var twitterName = x["poi_name"][1];
      var fullName = x["user.name"][0];
      var sentiment = "neutral";
      var created_at = x["created_at"][0];
      var tweetLang = x["tweet_lang"][0];
      var favorites = x["favorite_count"][0];
      var retweets = x["retweet_count"][0];
      var verified = x["user.verified"][0];
      if (sentiment == "negative") {
        this.state.negative += 1;
        this.setState({ negative: this.state.negative + 1 });
      } else if (sentiment == "positive") {
        this.state.positive += 1;
        this.setState({ positive: this.state.positive + 1 });
      } else {
        this.state.neutral += 1;
        this.setState({ neutral: this.state.neutral + 1 });
      }
      if (tweetLang == "en") {
        this.state.lang_en += 1;
        this.setState({ lang_en: this.state.lang_en + 1 });
      } else if (tweetLang == "pt") {
        this.state.lang_pt += 1;
        this.setState({ lang_pt: this.state.lang_pt + 1 });
      } else {
        this.state.lang_hi += 1;
        this.setState({ lang_hi: this.state.lang_hi + 1 });
      }

      const tweet = {
        tweetId: tweetId,
        fullName: fullName,
        twitterName: twitterName,
        tweetText: tweetText,
        sentiment: sentiment,
        created_at: created_at,
        imageUrl: imageUrl,
        favorites: favorites,
        retweets: retweets,
        verified: verified
      };
      let tweets = this.state.tweets;
      tweets.push(tweet);
      this.setState({
        tweets: tweets
      });
    }
  };

  getSearchResults() {
    var query = this.state.searchQuery;
    var hashtagCode = "";
    var searchQuery = this.state.searchQuery;
    if (!query) {
      return;
    }
    var news = [];
    const url =
      "http://newsapi.org/v2/everything?q=" +
      this.state.searchQuery +
      "&apiKey=53587d85c661482baadeb261e9f66ef8";
    let result = fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("URL", url);
        console.log("this is news baby : ", data.articles);
        data.articles.map(article => {
          var title = article.title;
          var description = article.description;
          var url = article.url;
          article = {
            title: title,
            description: description,
            url: url
          };
          news.push(article);
        });
      });
    this.setState({
      news: news
    });
    if (query.indexOf("#") === 0) {
      hashtagCode = "%23";
      searchQuery = searchQuery.substr(1);
    }
    if (query.indexOf("@") === 0) {
      hashtagCode = "%22";
      searchQuery = searchQuery.substr(1) + "%22";
    }
    this.setState(
      {
        tweets: [],
        negative: 0,
        positive: 0,
        lang_hi: 0,
        lang_en: 0,
        lang_pt: 0,
        neutral: 0,
        country_in: 0,
        country_br: 0,
        country_us: 0
      },
      () => {
        this.resetCondition();
      }
    );
  }

  SegmentedControlChanged = changedValue => {
    this.setState({
      segmentedControl: changedValue
    });
  };

  handleSearchQueryChange = event => {
    this.setState({ searchQuery: event.target.value });
  };

  handleIncrement = () => {
    let start = this.state.start + 15;
    console.log(start, "Increment");
    let numFound = this.state.numFound;
    if (start > numFound) {
      return;
    } else {
      this.setState(
        {
          tweets: [],
          start: start
        },
        () => {
          this.getSearchResults();
        }
      );
    }
  };

  handleDecrement = () => {
    let start = this.state.start - 15;
    console.log(start, "Decrement");
    if (start < 0) {
      return;
    } else {
      this.setState(
        {
          tweets: [],
          start: start
        },
        () => {
          this.getSearchResults();
        }
      );
    }
  };
  goForwardAnalytics = () => {
    let analyticsIndex = this.state.analyticsIndex;
    this.setState({
      analyticsIndex: analyticsIndex + 1
    });
    console.log("front - ", analyticsIndex + 1);
  };

  goBackwardAnalytics = () => {
    let analyticsIndex = this.state.analyticsIndex;
    this.setState({
      analyticsIndex: analyticsIndex - 1
    });
    console.log("back - ", analyticsIndex - 1);
  };

  countryFilterClicked = country => {
    var countryState = this.state.country;
    switch (country) {
      case "Usa":
        var UsaState = this.state.country.usa;
        countryState.usa = !UsaState;
        console.log("USA");
        break;
      case "Brazil":
        var brazilState = this.state.country.brazil;
        countryState.brazil = !brazilState;
        console.log("BRAZIL");
        break;
      case "India":
        var indiaState = this.state.country.india;
        countryState.india = !indiaState;
        console.log("INDIA");
        break;
    }
    console.log(countryState);
    this.setState(
      {
        country: countryState
      },
      this.getSearchResults()
    );
  };

  languageFilterClicked = lang => {
    var languageState = this.state.language;
    switch (lang) {
      case "EN":
        var englishState = this.state.language.english;
        languageState.english = !englishState;
        console.log("ENGLISH");
        break;
      case "HI":
        var hindiState = this.state.language.hindi;
        languageState.hindi = !hindiState;
        console.log("HINDI");
        break;
      case "PT":
        var portugueseState = this.state.language.portuguese;
        languageState.portuguese = !portugueseState;
        console.log("POTUGESE");
        break;
    }
    this.setState(
      {
        language: languageState
      },
      this.getSearchResults()
    );
  };

  sentimentFilterClicked = lang => {
    var sentimentState = this.state.sentiment;
    switch (lang) {
      case "Positive":
        var positiveState = this.state.sentiment.positive;
        sentimentState.positive = !positiveState;
        console.log("POSITIVE");
        break;
      case "Negative":
        var negativeState = this.state.sentiment.negative;
        sentimentState.negative = !negativeState;
        console.log("NEGATIVE");
        break;
      case "Neutral":
        var neutralState = this.state.sentiment.neutral;
        sentimentState.neutral = !neutralState;
        console.log("NEUTRAL");
        break;
    }
    this.setState(
      {
        sentiment: sentimentState
      },
      this.getSearchResults()
    );
  };

  searchButtonClicked = () => {
    this.setState(
      {
        start: 0,
        initialSearch: true
      },
      () => {
        this.getSearchResults();
      }
    );
  };

  render() {
    const initialSearch = this.state.initialSearch;
    const negative = this.state.negative;
    const positive = this.state.positive;
    const neutral = this.state.neutral;
    const eng = this.state.lang_en;
    const hin = this.state.lang_hi;
    const por = this.state.lang_pt;
    const c_in = this.state.country_in;
    const c_us = this.state.country_us;
    const c_br = this.state.country_br;
    const options_senti = {
      title: {
        text: "Sentiment Analysis for QuerySet"
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %"
          }
        }
      },
      series: [
        {
          name: "Sentiment",
          colorByPoint: true,
          data: [
            { name: "negative", y: negative, selected: true, sliced: true },
            { name: "positive", y: positive },
            { name: "neutral", y: neutral }
          ]
        }
      ]
    };
    const options_lang = {
      title: {
        text: "Language based Analysis for QuerySet"
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %"
          }
        }
      },
      series: [
        {
          name: "Language",
          colorByPoint: true,
          data: [
            { name: "English", y: eng, selected: true, sliced: true },
            { name: "Portuguese", y: por },
            { name: "Hindi", y: hin }
          ]
        }
      ]
    };
    const options_country = {
      title: {
        text: "Location Analysis for QuerySet"
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %"
          }
        }
      },
      series: [
        {
          name: "Country",
          colorByPoint: true,
          data: [
            { name: "India", y: c_in, selected: true, sliced: true },
            { name: "Brazil", y: c_br },
            { name: "USA", y: c_us }
          ]
        }
      ]
    };
    return (
      <div>
        <div className="LeftChild">
          <div className="center">
            <div className="leftA">
              {" "}
              <input
                type="text"
                name="FirstName"
                placeholder="Type here..."
                className="w3-input searchBar"
                onChange={this.handleSearchQueryChange}
              ></input>
              <button
                class="w3-btn w3-blue searchButton"
                onClick={this.searchButtonClicked}
              >
                Search
              </button>
            </div>
          </div>
          <div>
            <div className="left-align">
              <div align="center" className="filterDiv">
                <b>Language</b>
              </div>
              <div align="center" className="filterDiv2">
                <b>Country</b>
              </div>
              <div align="center" className="filterDiv3">
                <b>Sentiment</b>
              </div>
            </div>
            <div className="left-align">
              <div align="center" className="filterDiv">
                <Checkbox
                  color="primary"
                  key="EN"
                  checked={this.state.language.english}
                  onChange={() => this.languageFilterClicked("EN")}
                />
                English
                <Checkbox
                  color="primary"
                  key="HI"
                  checked={this.state.language.hindi}
                  onChange={() => this.languageFilterClicked("HI")}
                />
                Hindi
                <Checkbox
                  color="primary"
                  key="PT"
                  checked={this.state.language.portuguese}
                  onChange={() => this.languageFilterClicked("PT")}
                />
                Portuguese
              </div>
              <div align="center" className="filterDiv2">
                <Checkbox
                  color="primary"
                  key="Usa"
                  checked={this.state.language.Usa}
                  onChange={() => this.countryFilterClicked("Usa")}
                />
                USA
                <Checkbox
                  color="primary"
                  key="Brazil"
                  checked={this.state.language.Brazil}
                  onChange={() => this.countryFilterClicked("Brazil")}
                />
                Brazil
                <Checkbox
                  color="primary"
                  key="India"
                  checked={this.state.language.India}
                  onChange={() => this.countryFilterClicked("India")}
                />
                India
              </div>
              <div align="center" className="filterDiv3">
                <Checkbox
                  color="primary"
                  key="Positive"
                  checked={this.state.sentiment.positive}
                  onChange={() => this.sentimentFilterClicked("Positive")}
                />
                Positive
                <Checkbox
                  color="primary"
                  key="Negative"
                  checked={this.state.sentiment.negative}
                  onChange={() => this.sentimentFilterClicked("Negative")}
                />
                Negative
                <Checkbox
                  color="primary"
                  key="Neutral"
                  checked={this.state.sentiment.neutral}
                  onChange={() => this.sentimentFilterClicked("Neutral")}
                />
                Neutral
              </div>
            </div>
            <div align="center">
              <SegmentedControl
                name="oneDisabled"
                options={[
                  { label: "Tweets", value: "Tweets", default: true },
                  { label: "News", value: "News" }
                ]}
                setValue={newValue => this.SegmentedControlChanged(newValue)}
                style={{ width: 200, color: "#2196f3" }} // purple400
              />
            </div>
            {initialSearch ? (
              <div>
                {this.state.loading ? (
                  <div></div>
                ) : (
                  <div className="same-line">
                    <h5 className="results">
                      {this.state.segmentedControl === "Tweets" ? (
                        <div>
                          {" "}
                          Showing {this.state.start} -{" "}
                          {this.state.start + 15 < this.state.numFound ? (
                            <span>{this.state.start + 15}</span>
                          ) : (
                            <span>{this.state.numFound}</span>
                          )}{" "}
                          results out of {this.state.numFound} tweets.
                        </div>
                      ) : (
                        <div>Showing {this.state.news.length} articles</div>
                      )}
                    </h5>
                    {this.state.segmentedControl === "Tweets" ? (
                      <div>
                        {" "}
                        <a
                          href="#"
                          class="next round"
                          onClick={() => this.handleIncrement()}
                        >
                          &#8250;
                        </a>
                        <a
                          href="#"
                          class="previous round"
                          onClick={() => this.handleDecrement()}
                        >
                          &#8249;
                        </a>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="leftB">
            {this.state.loading ? (
              <div align="center">
                <img src={loaderimage} className="loader" alt="loading..." />
              </div>
            ) : (
              <div>
                {this.state.segmentedControl === "Tweets" ? (
                  <div>
                    {this.state.tweets.map(tweet => (
                      <TweetCard key={tweet.created_at} tweet={tweet} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {this.state.news.map(x => (
                      <NewsCard key={x.title} article={x} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="RightChild">
          <div className="hashtags" align="center">
            <img className="logo" src={ceetload}></img>
          </div>
          <div className="analytics">
            {initialSearch ? (
              <React.Fragment>
                {this.state.loading ? (
                  <div></div>
                ) : (
                  <div>
                    {this.state.numFound === 0 ? (
                      <div></div>
                    ) : (
                      <div>
                        {this.state.analyticsIndex % 3 === 0 ? (
                          <PieChart
                            highcharts={Highcharts}
                            options={options_country}
                          />
                        ) : (
                          <div></div>
                        )}
                        {this.state.analyticsIndex % 3 === 1 ? (
                          <PieChart
                            highcharts={Highcharts}
                            options={options_lang}
                          />
                        ) : (
                          <div></div>
                        )}
                        {this.state.analyticsIndex % 3 === 2 ? (
                          <PieChart
                            highcharts={Highcharts}
                            options={options_senti}
                          />
                        ) : (
                          <div></div>
                        )}

                        <div align="center" className="chartControls">
                          <a
                            href="#"
                            class="next round-analytics2"
                            onClick={() => this.goForwardAnalytics()}
                          >
                            &#8250;
                          </a>
                          <a
                            href="#"
                            class="previous round-analytics1"
                            onClick={() => this.goBackwardAnalytics()}
                          >
                            &#8249;
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default SearchButton;
