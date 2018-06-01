import React from "react";

// TO USE:
//
// import GoogleMap from "./GoogleMap";
//
//  Place a <GoogleMap /> where desired
//
//  Acceptable props to pass into GoogleMap:
//
//  address= Takes a string, will create a map with a marker on indicated address.
//  height= Takes a number inside an object, ex. {370.5}, determines map window height.
//  width= Takes a number inside an object, ex. {370.5}, determines map window width.
//  lat= Takes a number inside an object, ex. {370.5}, determines specific latitude cordinate of marker and map window center.
//  lng= Takes a number inside an object, ex. {370.5}, determines specific longitude cordinate of marker and map window center.
//  zoom= Takes a number inside an object, ex. {370.5}, determines zoom view of map. 1 = World, 5 = Landmass/Continent, 10 = City, 15 = Streets, 20 = Buildings .
//
// Example:
//
// <GoogleMap address='123 Fake St, San Francisco, CA' height={300} width={500} />
const googlePromise = new Promise(function(resolve) {
  window.initMap = function() {
    resolve(window.google);
  };
  console.log("initMap Passed");
});

loadScript(
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFkZYoWyqQ4fQ9SeJ2Fh9X4Ush--GQpXQ&callback=initMap"
);

class GoogleMap extends React.PureComponent {

  width = 300;
  height = 200;
  boxSize = {width: this.width, height: this.height}
  mapHandler = () => {
    googlePromise.then(google => {
      let lat = 33.988299;
      let lng = -118.383986;
      let zoomVal = 14;
      if (this.props.width && this.props.height) {
        this.width = this.props.width;
        this.height = this.props.height;
      }
      if (this.props.lat && this.props.lng) {
        lat = this.props.lat;
        lng = this.props.lng;
      }
      if (this.props.zoom) {
        zoomVal = this.props.zoom;
      }
      let latlng = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        zoom: zoomVal,
        center: latlng
      };
      let googleMap = new google.maps.Map(this.refs.map, mapOptions);
      let marker = new google.maps.Marker({
        map: googleMap,
        position: latlng
      });
      if (this.props.address) {
        marker.setMap(null);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.props.address }, (
          results,
          status
        ) => {
          if (status === "OK") {
            googleMap.setCenter(results[0].geometry.location);
            marker = new google.maps.Marker({
              map: googleMap,
              position: results[0].geometry.location
            });

            this.latLngOutput = results[0].geometry.location.toString().replace(/\(|\)/g, '').split(",")

          } else {
            alert(
              "Geocode was not successful for the following reason: " + status
            );
          }
        });
      }
    });
  };

  componentDidMount() {
    this.mapHandler();
  }

  componentDidUpdate() {
    this.mapHandler();
  }

  render() {
    return (
      <div ref="map" style={this.boxSize}>
        Loading map...
      </div>
    );
  }
}

export default GoogleMap;

function loadScript(url) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  head.appendChild(script);
}
