import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';
import App from './App.jsx'

 
export class MapContainer extends Component {
  render() {
    var longitude = this.props.newLong;
    var latitude = this.props.newLat;
    var points = this.props.zoom;
    var markers = this.props.markers;
    var temperature = this.props.temp;
    var city = this.props.newCity;
    var zip = this.props.newZip;

    console.log(markers[0]);
  

  var bounds = new this.props.google.maps.LatLngBounds();
  for (var i = 0; i < points.length; i++) {
    bounds.extend(points[i]);
  }

    return (
      <Map google={this.props.google} 
             zoom={4}
             style={{height:'100%', width:'100%'}}
              initialCenter={{
              lat: latitude,
              lng: longitude,
            }}
            bounds={bounds}
             >

      <Marker
          title={'Zip Code: ' + zip + '\n' +
                 'City: ' + city + '\n' +
                 'Temp: ' + temperature
                }
          position={{lat: latitude, lng: longitude}}
          icon={{
            url: "img/logo-color.svg",
            anchor: new google.maps.Point(32,32),
            scaledSize: new google.maps.Size(64,64)
          }} />

          {
            markers.map((marker,index) => (<Marker 
                                      title=   {'City: ' + marker.data.name + '\n ' +
                                                'Temp: ' + marker.data.main.temp + '\n ' + 
                                                'Humidity: ' + marker.data.main.temp
                                              
                                              }
                                      position={{lat: marker.data.coord.lat, lng: marker.data.coord.lon}}
                                      key={index}
             />))
          }
 
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDH415YN0Zo83xUmyf9D7XdWD6_9KcohFs'
})(MapContainer)