import React from "react";
import * as axios from "axios";

class MainComponent extends React.Component {
  state = {
    query: "",
    responses: null,
    resultsFor: null,
    searching: false
  };

  keyHandler = keyCode => {
    if (keyCode === 13 && this.state.searching === false) {
      this.getBooks();
    }
  };
  getBooks = () => {
    if (this.state.query) {
      this.setState({ searching: true });
      let body = {
        Text: this.state.query
      };
      axios
        .post("/api/find", body)
        .then(myResponse => {
          console.log("myResponse", myResponse);
          this.setState(
            { responses: myResponse.data, resultsFor: this.state.query },
            this.setState({ searching: false })
          );
        })
        .catch(error => console.log("get unsuccessful", error));
    }
  };

  render() {
    return (
      <div className="container" style={{ backgroundColor: "transparent" }}>
        <div className="row">
          <div
            className="col-sm-4 col-md-4 col-lg-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4"
            style={{
              marginTop: "10vh",
              marginBottom: "10vh",
              borderStyle: "solid",
              borderColor: "",
              backgroundImage:
                "url(https://dogfishalehouse.com/wp-content/uploads/2014/10/parchment-tile.jpg)",
              padding: "20px"
            }}
          >
            <h1 style={{ textAlign: "center" }}>Kid Lit Word Count</h1>
            <br />
            <h4 style={{ textAlign: "center" }}>
              Enter a Children's Book Title
            </h4>
            <input
              value={this.state.query}
              style={{ width: "100%" }}
              disabled={this.state.searching}
              onChange={e => this.setState({ query: e.target.value })}
              className={this.state.searching ? "disabled" : null}
              onKeyDown={e => this.keyHandler(e.keyCode)}
            />
            <br />
            <br />
            <button
              value="Search"
              className={
                this.state.searching
                  ? "disabled btn-primary btn btn-block"
                  : "btn btn-primary btn-block"
              }
              onClick={this.getBooks}
            >
              Search
            </button>

            {this.state.searching && <h3>Searching...</h3>}
            {this.state.responses && !this.state.searching ? (
              <div>
                <br />
                <h4>Results for: {this.state.resultsFor}</h4>
              </div>
            ) : null}
            {this.state.resultsFor && !this.state.responses ? (
              <div>
                <br />
                <br />
                <h4>No Results Found</h4>
              </div>
            ) : null}
            {this.state.responses && !this.state.searching
              ? this.state.responses.map((book, index) => (
                  <div key={index}>
                    <br />
                    <h3>{index + 1})</h3>
                    <h3>Title: {book.title}</h3>
                    <h3>Word Count: {book.count}</h3>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export default MainComponent;
