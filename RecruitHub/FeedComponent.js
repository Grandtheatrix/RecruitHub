import React from "react";
import * as Axios from "./server";
import PostComponent from "./PostComponent";
import SimpleModal from "./SimpleModal";
import PostItem from "./PostItem";
import moment from "moment";
import PostsTypeAhead from "./PostsTypeAhead";
import GoogleMap from "./GoogleMap";
import InfiniteScroll from "./InfiniteScroll";

class FeedComponent extends React.Component {
  state = {
    userId: null,
    userName: null,
    profileURL: null,
    postCount: 10,
    pageCount: 1,
    items: [],
    inputTags: false,
    inputBoxFocused: false,
    inputLocation: false,
    inputEventDate: false,
    inputItems: [],
    inputVideo: false,
    inputPostText: "",
    loading: false,
    postValidationText: ""
  };

  uploadItem(selectorFiles) {
    {
      this.setState({ loading: true });

      var bodyFormData = new FormData();
      bodyFormData.append("image", selectorFiles[0]);
      Axios.posts_fileUploader(bodyFormData).then(myResponse => {
        myResponse.data.items.map(url => this.addInputItem(url));
        this.setState({ loading: false });
      });
    }
  }

  addInputItem = url => {
    const newInputItem = {
      MediaURL: url,
      MediaType: "Image",
      Caption: ""
    };

    const inputItems = [...this.state.inputItems, newInputItem];

    this.setState({ inputItems });
  };

  addVideoItem = url => {
    const newInputItem = {
      MediaURL: url,
      MediaType: "Video",
      Caption: ""
    };

    const inputItems = [...this.state.inputItems, newInputItem];

    this.setState({ inputItems });
  };

  updateItem = (item, index) => {
    const inputItems = [
      ...this.state.inputItems.slice(0, index),
      item,
      ...this.state.inputItems.slice(index + 1)
    ];

    this.setState({ inputItems });
  };

  deleteItem = index => {
    const inputItems = [
      ...this.state.inputItems.slice(0, index),
      ...this.state.inputItems.slice(index + 1)
    ];

    this.setState({ inputItems });
  };

  postHandler = () => {
    this.setState({ postValidationText: "" });

    if (
      !this.state.inputEventDate &&
      !this.state.inputLocation &&
      !this.state.inputPostText &&
      this.state.inputItems.length === 0
    ) {
      this.setState({
        postValidationText: "C'mon, you gotta wanna say SOMETHING...:P"
      });
      return;
    }

    const tags = [];
    const items = [];
    let lat = 0;
    let long = 0;

    if (this.state.inputTags) {
      let inputTags = this.state.inputTags;
      if (typeof inputTags === "string") {
        inputTags = this.state.inputTags.split(",");
      }
      for (let i of inputTags) {
        tags.push({ TaggerId: this.state.userId, TaggedId: i });
      }
    }

    if (this.state.googleMapLocation) {
      lat = Number.parseFloat(this.refs.googleMap.latLngOutput[0]);
      long = Number.parseFloat(this.refs.googleMap.latLngOutput[1]);
    }

    const input = {
      Location: this.state.inputLocation,
      Lat: lat,
      Long: long,
      EventDate: this.state.inputEventDate,
      PostText: this.state.inputPostText,
      PostItemsJSON: JSON.stringify({
        items: this.state.inputItems,
        tags: tags
      })
    };

    for (let i in input) {
      if (input[i] === false) {
        input[i] = "";
      }
    }

    if (input.EventDate === "") {
      input.EventDate = moment(new Date()).format("YYYY-MM-DD");
    }
    console.log("Input Data", input);

    Axios.posts_create(input)
      .then(response => {
        console.log("Post Successful", response);
        this.getUserPosts();
        this.setState({
          inputBoxFocused: false,
          inputLocation: false,
          inputEventDate: false,
          inputTags: false,
          inputPostText: "",
          inputItems: []
        });
      })
      .catch(error => console.log("error", error));
  };

  getUserPosts = () => {
    this.setState({ postsLoading: true });
    Axios.posts_getByUser(this.state.pageCount, this.state.postCount)
      .then(myResponse => {
        console.log("myResponse", myResponse);
        this.setState({
          items: JSON.parse(myResponse.data.item),
          postsLoading: false
        });
        console.log(this.state.items);
      })

      .catch(error => console.log("error", error));
  };

  seeMorePosts = () => {
    this.setState({ postCount: this.state.postCount + 10 }, this.getUserPosts);
  };

  typeAheadSelector = selection => {
    const typeAheadArray = [];

    for (let i of selection) {
      typeAheadArray.push(i.id);
    }

    this.setState({ inputTags: typeAheadArray });
  };

  uploadVideo = () => {
    if (/^https?:\/\/.*(vimeo|youtu\.?be)/.test(this.state.inputVideo)) {
      this.addVideoItem(this.state.inputVideo);
      this.setState({ inputVideo: false });
    } else {
      alert("Please enter a valid Youtube or Vimeo Link.");
    }
  };

  componentDidMount() {
    Axios.users_getCurrentUser().then(myResponse => {
      console.log("current User data", myResponse);

      const name = myResponse.data.firstName + " " + myResponse.data.lastName;
      const url = myResponse.data.avatarUrl;
      const userId = myResponse.data.id;

      this.setState({
        userName: name,
        profileURL: url,
        userId: userId
      });
    });
    this.getUserPosts();
  }
  render() {
    return (
      <React.Fragment>
        <div
          className="row"
          onFocus={() => this.setState({ inputBoxFocused: true })}
          onBlur={() => this.setState({ inputBoxFocused: false })}
        >
          <div className="col-md-8">
            <div className="panel rounded shadow">
              <form action="...">
                <textarea
                  className="form-control input-lg"
                  onChange={e =>
                    this.setState({ inputPostText: e.target.value })
                  }
                  rows={this.state.inputBoxFocused ? "6" : "2"}
                  placeholder="What's on your mind?..."
                  value={this.state.inputPostText}
                />
                {this.state.inputLocation !== false && (
                  <React.Fragment>
                    <input
                      value={this.state.inputLocation}
                      placeholder="Where?"
                      onChange={e =>
                        this.setState({ inputLocation: e.target.value })
                      }
                    />
                    <input
                      type="button"
                      value="Show with Google Map"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({
                          googleMapLocation: this.state.inputLocation
                        });
                      }}
                    />
                    {this.state.googleMapLocation && (
                      <GoogleMap
                        ref="googleMap"
                        address={this.state.googleMapLocation}
                      />
                    )}
                  </React.Fragment>
                )}
                {this.state.inputEventDate !== false && (
                  <input
                    type="date"
                    value={this.state.inputEventDate}
                    placeholder="When?"
                    onChange={e =>
                      this.setState({ inputEventDate: e.target.value })
                    }
                  />
                )}
                {this.state.inputVideo !== false && (
                  <React.Fragment>
                    <input
                      type="url"
                      value={this.state.inputVideo}
                      onChange={e =>
                        this.setState({ inputVideo: e.target.value })
                      }
                    />
                    <button onClick={this.uploadVideo}> Submit Link </button>
                  </React.Fragment>
                )}
                {this.state.inputTags !== false && (
                  <PostsTypeAhead onChange={this.typeAheadSelector} />
                )}
                {this.state.loading && <p style={{}}>Loading...</p>}
                {this.state.postValidationText && (
                  <p>{this.state.postValidationText}</p>
                )}
                {this.state.inputItems &&
                  this.state.inputItems.map((item, i) => (
                    <PostItem
                      key={i}
                      item={item}
                      tagsDisabled={true}
                      onChange={newItem => this.updateItem(newItem, i)}
                      onDelete={() => this.deleteItem(i)}
                    />
                  ))}
              </form>
              <div className="panel-footer">
                <button
                  className="btn btn-success pull-right mt-5"
                  onClick={() => this.postHandler()}
                >
                  POST
                </button>
                <ul className="nav nav-pills">
                  <li>
                    <a
                      href="#"
                      onMouseDown={e => this.setState({ inputTags: "" })}
                    >
                      <i className="fa fa-user" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onMouseDown={e => this.setState({ inputLocation: "" })}
                    >
                      <i className="fa fa-map-marker" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onMouseDown={e => this.setState({ inputEventDate: "" })}
                    >
                      <i className="glyphicon glyphicon-calendar" />
                    </a>
                  </li>
                  <li>
                    <a href="#" onMouseDown={() => this.inputElement.click()}>
                      <i className="fa fa-camera" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onMouseDown={() => this.setState({ inputVideo: "" })}
                    >
                      <i class="glyphicon glyphicon-facetime-video" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <input
          type="file"
          ref={input => (this.inputElement = input)}
          className="hidden"
          onChange={e => this.uploadItem(e.target.files)}
        />

        {this.state.items &&
          this.state.items.map(map => (
            <div className="row">
              <PostComponent
                userId={this.state.userId}
                userName={this.state.userName}
                profileURL={this.state.profileURL}
                id={map.Id}
                userId={map.UserId}
                postText={map.PostText ? map.PostText : ""}
                eventDate={map.EventDate}
                items={map.items ? map.items : ""}
                likes={map.likes ? map.likes : null}
                tags={map.tags ? map.tags : ""}
                location={map.Location}
                lat={map.Lat}
                long={map.Long}
                getUserPosts={this.getUserPosts}
                dateCreated={map.DateCreated}
                dateModified={map.DateModified}
              />
            </div>
          ))}
        {!this.state.postsLoading && (
          <InfiniteScroll
            onVisible={() => {
              this.setState({ postCount: this.state.postCount + 10 });
              this.getUserPosts();
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default FeedComponent;
