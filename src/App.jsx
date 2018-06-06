import React, { Component } from 'react';
import axios from 'axios';
import MapContainer from './googleapi.jsx';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: '',
      lat: 39.8333333,
      long: -98.585522,
      state: '',
      city: '',
      temp: '',
      markersArray: [],
      rezoom: [],
    }
    this.addZip = this.addZip.bind(this);
    this.caputureZipData = this.captureZipData.bind(this);
  }

  addZip(zipAdded) {
    this.setState({ zipCode: zipAdded.target.value })
  }


  captureZipData() {
    let makersArray = []
    axios
      .get('https://www.zipcodeapi.com/rest/YBTV04XBZpuO9ZUJSlavEDMZDtGAp3RAuwgx0HdPSFGG2swwsRqDVhzaUGAW4w0V/info.json/' + this.state.zipCode + '/degrees')
      .then((response) => {
        const zipData = response.data;
        this.setState({
          lat: zipData.lat, //setting long/lat/state/city for egress marker
          long: zipData.lng,
          state: zipData.state,
          city: zipData.city,
        })
      })
      .then(() => axios.get('http://api.openweathermap.org/data/2.5/weather?lat=' + this.state.lat + '&lon=' + this.state.long + '&units=Imperial&APPID=2bbed4ca6f3800d307fab4cade42b173'))
      .then((response) => {
        const weatherData = response.data;
        this.setState({
          temp: weatherData.main.temp,//setting temperature for egress marker
        })
        return Promise.resolve()//catch up
      })
      .then(() => axios.get('https://www.zipcodeapi.com/rest/YBTV04XBZpuO9ZUJSlavEDMZDtGAp3RAuwgx0HdPSFGG2swwsRqDVhzaUGAW4w0V/radius.json/' + this.state.zipCode + '/10/mile'))
      .then((response) => {
        const zipData = response.data.zip_codes; //returns an array of ojects including zip codes/city/state BUT no lat/long
        return zipData.map(zipObject => axios.get('https://www.zipcodeapi.com/rest/YBTV04XBZpuO9ZUJSlavEDMZDtGAp3RAuwgx0HdPSFGG2swwsRqDVhzaUGAW4w0V/info.json/' + zipObject.zip_code + '/degrees'))
      })
      .then((promises) => Promise.all(promises))//What does this do exactly
      .then((responses) => {
        //console.log(responses);
        var newArray = responses;
        var coordinates = newArray.map(coordinates => ({
           lat: coordinates.data.lat,
           lng: coordinates.data.lng,
         }))

         this.setState({
           rezoom: coordinates,
         })

         return newArray.map(tempAdd => axios.get('http://api.openweathermap.org/data/2.5/weather?lat=' + tempAdd.data.lat + '&lon=' + tempAdd.data.lng + '&units=Imperial&APPID=2bbed4ca6f3800d307fab4cade42b173'))
        })
        .then((promises) => Promise.all(promises))
        .then((responses) => {
            //console.log(responses);
            var markersArray = [...responses]
            this.setState({
              markersArray: markersArray,
              })
            console.log(this.state.markersArray);
        })
      }

  

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-12">
          <div className="col-md-4">
            <div>
              <img src="img/logo-color.svg" height="300" width="300" />
              <div><span className="logo1">e</span><span className="logo2">gress</span></div>
              <input defaultValue={this.state.zipCode} onChange={this.addZip} className="input" /><br></br>
              <button type="button" className="btn btn-success center-align" onClick={this.caputureZipData}>SEARCH ZIP</button>
            </div>
            <div className="text">
              <h3>As the price of city housing continues to climb, populations are beginning to <span className="logo1small">e</span><span className="logo2small">gress™</span> away from their employers.
                  They have chosen to trade more affordable housing for longer commutes. Enter your employers' zipcode above to compare
                      the price of housing further out and decide if egression is right for you.</h3>
            </div>
          </div>
          <div className="col-md-8">
            <MapContainer newZip={this.state.zipCode}
              newCity={this.state.city}
              newState={this.state.state}
              newLong={this.state.long}
              newLat={this.state.lat}
              markers={this.state.markersArray}
              zoom={this.state.rezoom}
              temp={this.state.temp}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;