import React from "react";

class PostItemCreator extends React.Component {
  state = {
    items: [],
    itemTags: []
  };

  updateTag = input => {
    const newItem = {
      ...this.props.item,
      tags: input
    };
    console.log("newItem", newItem);
    this.props.onChange(newItem);
  };

  updateCaption = e => {
    const newItem = {
      ...this.props.item,
      Caption: e.target.value
    };

    this.props.onChange(newItem);
  };

  componentDidMount() {
    if (this.props.itemTags) {
      const tagIntArray = this.props.itemTags.map(tag => tag.taggedid);
      this.setState({ itemTags: tagIntArray });
    }
  }

  deleteItem = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      this.props.onDelete();
    }
  };

  render() {
    return (
      <div style={{ border: "1px solid #999", margin: "1em" }} className="row">
        <div style={{ "background-color": "black" }}>
          {this.props.item.MediaType === "Image" && (
            <img
              className="col-md-2"
              type="text"
              src={this.props.item.MediaURL}
              style={{ "max-width": "auto", "max-height": "10em" }}
            />
          )}
          {this.props.item.MediaType === "Video" && (
            <img
              className="col-md-2"
              type="text"
              src="http://mobile.softpedia.com/screenshots/icon_flv-player-android.jpg"
              style={{ "max-width": "auto", "max-height": "10em" }}
            />
          )}
        </div>
        <div className="col-md-10">
          <textarea
            className="col-md-12"
            rows="4"
            value={this.props.item.Caption}
            style={{ display: "inline" }}
            onChange={this.updateCaption}
            placeholder="Write a caption..."
          />
        </div>
        <div>
          {!this.props.tagsDisabled && (
            <input
              value={this.state.itemTags}
              onChange={e =>
                this.setState({ itemTags: e.target.value }, () =>
                  this.updateTag(this.state.itemTags)
                )
              }
              placeholder="Tag Friends!"
            />
          )}
          <button className="pull-right" onClick={this.deleteItem}>
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default PostItemCreator;
