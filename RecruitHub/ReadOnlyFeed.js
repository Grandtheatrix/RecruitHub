import React from "react";
import * as Axios from "./server";
import PostComponent from "./PostComponent";
import SimpleModal from "./SimpleModal";
import PostItem from "./PostItem";
import moment from "moment";
import PostsTypeAhead from "./PostsTypeAhead";
import GoogleMap from "./GoogleMap";
import ReadOnlyPost from "./ReadOnlyPost";
import InfiniteScroll from "./InfiniteScroll";

///////////////////////////////////////////////////////////////////////
// Usage:
//
//      <ReadOnlyFeed postIds={[Post, Ids, go, here]} />
//
//
///////////////////////////////////////////////////////////////////////

class ReadOnlyFeed extends React.Component {
  state = {
    userId: null,
    userName: null,
    profileURL: null,
    postCount: 10,
    pageCount: 1,
    items: [],
    loading: false,
    postValidationText: ""
  };

  getPosts = () => {
    this.setState({ loading: true });
    const posts = [];
    const promises = [];
    const maxPostIndex = Math.min(
      this.props.postIds.length,
      this.state.postCount
    );
    for (let i = 0; i < maxPostIndex; i++) {
      const promise = Axios.posts_getById(this.props.postIds[i]);
      promises.push(promise);
    }

    Promise.all(promises)
      .then(values => {
        for (let j of values) {
          if (j.data.item) {
            posts.push(JSON.parse(j.data.item)[0]);
          } else {
            console.log("No Corresponding PostId");
          }
        }
        this.setState({ items: posts, loading: false });
      })
      .catch(error => console.log("error", error));
  };

  seeMorePosts = () => {
    this.setState({ postCount: this.state.postCount + 10 }, this.getPosts);
  };

  componentDidMount() {
    this.getPosts();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.items &&
          this.state.items.map(map => (
            <div className="row">
              <ReadOnlyPost
                id={map.Id}
                userId={map.UserId}
                postText={map.PostText ? map.PostText : ""}
                eventDate={map.EventDate}
                items={map.items ? map.items : ""}
                likes={map.likes ? map.likes : null}
                lat={map.Lat}
                long={map.Long}
                tags={map.tags ? map.tags : ""}
                location={map.Location}
                getPosts={this.getPosts}
                dateCreated={map.DateCreated}
                dateModified={map.DateModified}
              />
            </div>
          ))}
        {!this.state.loading && (
          <InfiniteScroll
            onVisible={() => {
              console.log("infinite scroll firing");
              this.setState({ postCount: this.state.postCount + 10 });
              this.getPosts();
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ReadOnlyFeed;
