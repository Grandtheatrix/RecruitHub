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
    showGoogleMap: false,
    liked: false
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      itemsLoc: null,
      editMode: false
    });
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
          console.log("GetUserNames Successful", resp);
          this.setState({
            displayTags: [...this.state.displayTags, resp.fullName]
          });
        },
        err => console.error("Error getting user avatar.", err)
      );
    }
  };

  likeHandler = () => {
    if (this.state.liked) {
      Axios.postLikes_delete(this.props.id)
        .then(myResponse => {
          console.log("Delete Successful");
          this.setState({ liked: false }, () => this.props.getPosts());
        })
        .catch(error => console.log("error", error));
    } else {
      Axios.postLikes_create(this.props.id)
        .then(myResponse => {
          console.log("Post Successful");
          this.setState({ liked: true }, () => this.props.getPosts());
        })
        .catch(error => console.log("error", error));
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
    Axios.users_getById(this.props.userId).then(myResponse =>
      this.setState({
        profileURL: myResponse.data.item.avatarUrl,
        userName:
          myResponse.data.item.firstName + " " + myResponse.data.item.lastName
      })
    );
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
                    src={this.state.profileURL}
                    alt="..."
                    className="img-circle"
                  />
                </div>
                <div className="media-body">
                  <a
                    href="#"
                    className="media-heading block mb-0 h4 text-white"
                  >
                    {this.state.userName}
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
