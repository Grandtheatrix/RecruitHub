import React from "react";
import SimpleModal from "./SimpleModal";
import PostItem from "./PostItem";
import * as Axios from "./server";
import { showModal } from "./SmallModal";
import { getAvatarById } from "./UserAvatarMultiplexer";
import VideoPlayer from "./VideoPlayer";
import GoogleMap from "./GoogleMap";

class PostComponent extends React.Component {
  state = {
    showModal: false,
    displayTags: false,
    itemsLoc: null,
    editMode: false,
    editPostText: null,
    editTags: null,
    editItemsArray: [],
    editLocation: null,
    editEventDate: null,
    liked: false,
    showGoogleMap: false,
    googleMapLocation: false
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
      Caption: ""
    };

    const editItemsArray = [...this.state.editItemsArray, newInputItem];

    this.setState({ editItemsArray });
  };
  updateEditItem = (item, index) => {
    const editItemsArray = [
      ...this.state.editItemsArray.slice(0, index),
      item,
      ...this.state.editItemsArray.slice(index + 1)
    ];

    this.setState({ editItemsArray });
  };

  deleteEditItem = index => {
    const editItemsArray = [
      ...this.state.editItemsArray.slice(0, index),
      ...this.state.editItemsArray.slice(index + 1)
    ];

    this.setState({ editItemsArray });
  };

  submitEdit = () => {
    let lat = 0;
    let long = 0;
    const items = [];
    const tags = [];

    for (let i of this.state.editItemsArray) {
      if (i.tags) {
        let splitTags = i.tags;

        if (typeof splitTags === "string") {
          splitTags = i.tags.split(",");

          for (let j of splitTags) {
            tags.push({
              PostItemId: i.Id,
              TaggedId: j,
              TaggerId: this.props.userId,
              PostId: this.props.id
            });
          }
        } else {
          for (let j of splitTags) {
            tags.push({
              PostItemId: i.Id,
              TaggedId: j.taggedid,
              TaggerId: this.props.userId,
              PostId: this.props.id
            });
          }
        }
      }

      if (i.Id) {
        var clone = i;
        clone.tags = "";
        items.push(clone);
      } else {
        items.push({
          MediaURL: i.MediaURL,
          MediaType: "Image",
          Caption: i.Caption
        });
      }
    }

    if (this.state.editTags) {
      let splitTags = this.state.editTags;

      if (typeof splitTags === "string") {
        splitTags = this.state.editTags.split(",");
      }

      for (let k of splitTags) {
        tags.push({
          TaggedId: k,
          TaggerId: this.props.userId,
          PostId: this.props.id
        });
      }
    }

    if (this.state.googleMapLocation) {
      lat = Number.parseFloat(this.refs.editGoogleMap.latLngOutput[0]);
      long = Number.parseFloat(this.refs.editGoogleMap.latLngOutput[1]);
    }

    const input = {
      Id: this.props.id,
      Location: this.state.editLocation,
      Lat: lat,
      Long: long,
      EventDate: this.state.editEventDate,
      PostText: this.state.editPostText,
      PostItemsJSON: JSON.stringify({ items: items, tags: tags })
    };

    console.log(" Update Data submit: ", input);

    Axios.posts_update(input)
      .then(response => {
        console.log("Update Successful", response);
        this.props.getUserPosts();
        this.closeModal();
      })
      .catch(error => console.log("error", error));
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      itemsLoc: null,
      editMode: false
    });
  };

  deletePost = () => {
    Axios.posts_delete(this.props.id)
      .then(myResponse => {
        console.log("Delete Successful");
        this.props.getUserPosts();
        this.closeModal();
      })
      .catch(error => console.log("error", error));
  };

  areYouSure = () => {
    showModal({
      title: "Are You Sure?",
      body:
        "Deleting a post is an irreversible process. Are you sure you would like to continue?"
    }).then(() => this.deletePost());
  };
  likeHandler = () => {
    if (this.state.liked) {
      Axios.postLikes_delete(this.props.id)
        .then(myResponse => {
          console.log("Delete Successful");
          this.setState({ liked: false }, () => this.props.getUserPosts());
        })
        .catch(error => console.log("error", error));
    } else {
      Axios.postLikes_create(this.props.id)
        .then(myResponse => {
          console.log("Post Successful");
          this.setState({ liked: true }, () => this.props.getUserPosts());
        })
        .catch(error => console.log("error", error));
    }
  };
  tagChecker = () => {
    if (this.props.tags) {
      this.setState(
        { editTags: this.props.tags.map(item => item.TaggedId) },
        () => this.getTagNames()
      );
    }
  };

  getTagNames = () => {
    for (let i of this.state.editTags) {
      getAvatarById(i).then(
        resp => {
          this.setState({
            displayTags: [...this.state.displayTags, resp.fullName]
          });
        },
        err => console.error("Error getting user avatar.", err)
      );
    }
  };

  componentDidMount() {
    if (this.props.likes) {
      for (let i of this.props.likes) {
        if (i.UserId === this.props.userId) this.setState({ liked: true });
      }
    }

    if (this.props.tags) {
      this.setState(
        { editTags: this.props.tags.map(item => item.TaggedId) },
        this.getTagNames
      );
    }
  }

  render() {
    return (
      <div className="col-md-8">
        <div className="panel panel-success rounded shadow">
          <div className="panel-heading no-border">
            <div className="pull-left half">
              <div className="media">
                <div className="media-object pull-left">
                  <img
                    src={this.props.profileURL}
                    alt="..."
                    className="img-circle"
                  />
                </div>
                <div className="media-body">
                  <a
                    href="#"
                    className="media-heading block mb-0 h4 text-white"
                  >
                    {this.props.userName}
                  </a>
                  {this.props.location && (
                    <p className="text-white h6">
                      in {this.props.location}{" "}
                      {this.props.lat && this.props.long ? (
                        <a
                          href="#"
                          onMouseDown={() =>
                            this.setState({ showGoogleMap: true })
                          }
                        >
                          <i className="fa fa-map-marker text-white" />
                        </a>
                      ) : null}
                      {this.state.showGoogleMap && (
                        <GoogleMap lat={this.props.lat} lng={this.props.long} />
                      )}
                    </p>
                  )}
                  <p className="text-white h6"> {this.props.eventDate}</p>
                  {this.state.displayTags && (
                    <p className="text-white h6">
                      {" "}
                      {this.state.displayTags[0]} and{" "}
                      {this.state.displayTags.length - 1} others tagged in this
                      post.
                    </p>
                  )}
                  <a
                    href="#"
                    className="text-white"
                    onClick={() =>
                      this.setState(
                        {
                          editMode: true,
                          editPostText: this.props.postText,
                          editItemsArray: this.props.items,
                          editLocation: this.props.location,
                          editEventDate: this.props.eventDate
                        },
                        this.setState({ showModal: true }, () =>
                          this.tagChecker()
                        )
                      )
                    }
                  >
                    <i className="glyphicon glyphicon-pencil" />
                  </a>
                </div>
              </div>
            </div>
            <div className="pull-right">
              <a
                href="#"
                className="text-white h4"
                onClick={() => this.likeHandler()}
              >
                {this.props.likes ? (
                  this.props.likes.length
                ) : (
                  <span>No Likes Yet! </span>
                )}
                <i className="fa fa-heart" />
              </a>
            </div>
            <div className="clearfix" />
          </div>
          <div className="panel-body no-padding">
            <div className="inner-all block">
              {this.props.postText && (
                <blockquote className="mb-10">{this.props.postText}</blockquote>
              )}
              {this.props.items &&
                this.props.items.map((map, index) => (
                  <div>
                    {map.MediaType === "Image" && (
                      <img
                        key={index}
                        data-no-retina
                        src={map.MediaURL}
                        onClick={() =>
                          this.setState(
                            { itemsLoc: index },
                            this.setState({ showModal: true })
                          )
                        }
                        alt="..."
                        width="100"
                      />
                    )}
                    {map.MediaType === "Video" && (
                      <VideoPlayer
                        url={map.MediaURL}
                        height={200}
                        width={400}
                      />
                    )}
                    {map.Caption && <p>{map.Caption}</p>}
                    {map.tags && (
                      <small>
                        {" "}
                        {map.tags[0].taggedid} and {map.tags.length - 1} others
                        tagged in this post.
                      </small>
                    )}
                  </div>
                ))}

              {this.state.showModal && (
                <SimpleModal>
                  {!this.state.editMode && (
                    <div
                      tabindex="-2"
                      role="dialog"
                      aria-hidden="true"
                      className="PostImagesModal"
                    >
                      <div className="row">
                        <div
                          className="col-md-8 col-sm-12"
                          style={{ "background-color": "black" }}
                        >
                          {this.state.itemsLoc > 0 && (
                            <i
                              class="glyphicon glyphicon-chevron-left"
                              onClick={() =>
                                this.setState({
                                  itemsLoc: this.state.itemsLoc - 1
                                })
                              }
                            />
                          )}
                          {this.state.itemsLoc <
                            this.props.items.length - 1 && (
                            <i
                              class="glyphicon glyphicon-chevron-right pull-right"
                              onClick={() =>
                                this.setState({
                                  itemsLoc: this.state.itemsLoc + 1
                                })
                              }
                            />
                          )}
                          <div className="modal-photo">
                            <img
                              data-no-retina
                              src={
                                this.props.items[this.state.itemsLoc].MediaURL
                              }
                              className="photo img-responsive"
                              alt="..."
                              style={{
                                height: "70vh",
                                width: "auto",
                                "margin-left": "auto",
                                "margin-right": "auto"
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12">
                          <div className="media-details">
                            <button
                              aria-hidden="true"
                              data-dismiss="modal"
                              className="close"
                              onClick={e => this.setState({ showModal: false })}
                            >
                              ×
                            </button>
                            <p className="">
                              {this.props.items[this.state.itemsLoc].Caption}
                            </p>
                            <div className="details">
                              <h4>Photo Details</h4>
                              <ul className="list-group no-margin">
                                <li className="list-group-item">
                                  <span className="badge">
                                    {this.props.eventDate}
                                  </span>
                                  <i className="fa fa-rocket" /> Published
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {this.state.editMode && (
                    <div className="EditModal">
                      <button
                        aria-hidden="true"
                        data-dismiss="modal"
                        className="close"
                        onClick={() => this.closeModal()}
                        type="button"
                      >
                        ×
                      </button>
                      <textarea
                        className="form-control input-lg"
                        onChange={e =>
                          this.setState({ editPostText: e.target.value })
                        }
                        rows="2"
                        placeholder="What's on your mind?..."
                        value={this.state.editPostText}
                      />
                      <input
                        type="text"
                        value={this.state.editLocation}
                        placeholder="Where?"
                        onChange={e =>
                          this.setState({ editLocation: e.target.value })
                        }
                      />
                      <input
                        type="button"
                        value="Show with Google Map"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({
                            googleMapLocation: this.state.editLocation
                          });
                        }}
                      />
                      {this.state.googleMapLocation && (
                        <GoogleMap
                          ref="editGoogleMap"
                          address={this.state.googleMapLocation}
                        />
                      )}
                      <input
                        type="text"
                        value={this.state.editEventDate}
                        placeholder="When?"
                        onChange={e =>
                          this.setState({ editEventDate: e.target.value })
                        }
                      />
                      {this.state.editItemsArray &&
                        this.state.editItemsArray.map((item, i) => (
                          <div>
                            <PostItem
                              key={item.Id}
                              tagsDisabled={true}
                              item={item}
                              itemTags={item.tags || []}
                              onChange={newItem =>
                                this.updateEditItem(newItem, i)
                              }
                              onDelete={() => this.deleteEditItem(i)}
                            />
                          </div>
                        ))}
                      <button onClick={() => this.submitEdit()}>
                        {" "}
                        Submit Edit{" "}
                      </button>
                      <button onClick={() => this.areYouSure()}>
                        {" "}
                        Delete Post{" "}
                      </button>
                      <button onClick={() => this.inputElement.click()}>
                        {" "}
                        Add Media{" "}
                      </button>
                      <input
                        type="file"
                        className="hidden"
                        ref={input => (this.inputElement = input)}
                        onChange={e => this.uploadItem(e.target.files)}
                      />
                      {/* <a href="#" style={{ display: "inline" }}>
                        <i className="fa fa-user pull-left" />
                      </a> */}

                      {/* <input value={this.state.editTags} 
                                                   className="col-md-8" 
                                                   placeholder="Tag friends!" 
                                                   onChange={e => this.setState({ editTags: e.target.value })} /> */}
                    </div>
                  )}
                </SimpleModal>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostComponent;
