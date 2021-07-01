/* global google */
import React from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleMapReady = this.handleMapReady.bind(this);
  }

  handleMapReady(mapProps, map) {
    if(this.props.data != null && this.props.data.length >= 2)
    {
      this.calculateAndDisplayRoute(map);
    }
  }

  calculateAndDisplayRoute(map) {
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    const waypoints = this.props.data.map(item => {
      return {
        location: { lat: item.lat, lng: item.lng },
        stopover: true
      };
    });
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: "WALKING"
      },
      (response, status) => {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

  render() {
    return (
      <div className="map-container">
        <Map
          google={this.props.google}
          className={"map"}
          zoom={this.props.zoom}
          initialCenter={this.props.center}
          onReady={this.handleMapReady}
          style={this.props.style}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBpWEax6YkpcKMP3EG_s2TaqMd9l-WjeNw",
  libraries: []
})(MapContainer);
