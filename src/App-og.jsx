import React, { Component } from 'react';
import axios from 'axios';
import MapContainer from './googleapi.jsx';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      zipCode: '',
      lat: 39.8333333,
      long: -98.585522,
      weather: '',
      state:'',
      city:'',
      markersArray:[],
      markersArray2:[
        {zip_code: "92251", lat: 32.881473, lng: -115.675592, city: "Imperial", state: "CA"},
        {zip_code: "92259", lat: 32.737718, lng: -115.932284, city: "Ocotillo", state: "CA"},
        {zip_code: "92273", lat: 32.817246, lng: -115.700235, city: "Seeley", state: "CA"},
        {zip_code: "92243", lat: 32.770206, lng: -115.598821, city: "El Centro", state: "CA"},
        {zip_code: "92244", lat: 32.789973, lng: -115.570175, city: "El Centro", state: "CA"},
        {zip_code: "92281", lat: 33.051757, lng: -115.608561, city: "Westmorland", state: "CA"},
        {zip_code: "92227", lat: 32.990107, lng: -115.358753, city: "Brawley", state: "CA"},
        {zip_code: "92231", lat: 32.68753, lng: -115.540955, city: "Calexico", state: "CA"},
        {zip_code: "92232", lat: 32.669997, lng: -115.500275, city: "Calexico", state: "CA"},
        {zip_code: "92249", lat: 32.725574, lng: -115.472763, city: "Heber", state: "CA"}     
      ],
      rezoom:[],
    }
    this.addZip = this.addZip.bind(this);
    this.caputureZipData = this.captureZipData.bind(this);
  }

  addZip(zipAdded){
        this.setState({zipCode: zipAdded.target.value})
  }


  captureZipData(){

    
    axios
    .get('https://www.zipcodeapi.com/rest/YBTV04XBZpuO9ZUJSlavEDMZDtGAp3RAuwgx0HdPSFGG2swwsRqDVhzaUGAW4w0V/info.json/' + this.state.zipCode + '/degrees')
    .then(function(response){
        const zipData = response.data;
        console.log(zipData);
        this.setState({
           lat: zipData.lat,
           long: zipData.lng,
           state: zipData.state,
           city: zipData.city,
           })
      }.bind(this))
      

    axios
    .get('https://www.zipcodeapi.com/rest/YBTV04XBZpuO9ZUJSlavEDMZDtGAp3RAuwgx0HdPSFGG2swwsRqDVhzaUGAW4w0V/radius.json/'+ this.state.zipCode + '/20/mile')
    .then(function(response){
      const zipData = response.data.zip_codes; 
      const markersArr = [];
      zipData.map(zipObject => axios                   
                              .get('https://www.zipcodeapi.com/rest/YBTV04XBZpuO9ZUJSlavEDMZDtGAp3RAuwgx0HdPSFGG2swwsRqDVhzaUGAW4w0V/info.json/' + zipObject.zip_code + '/degrees')
                              .then(function(response){
                               const longlatData = response.data;
                              markersArr.push(longlatData);
                              }))
      this.setState({
        markersArray:markersArr,
      })
      console.log(this.state.markersArray);
    }.bind(this))


    const newArray = [...this.state.markersArray];

    var coordinates = newArray.map(coordinates=>({
       lat: coordinates.lat,
       lng: coordinates.lng,
     }))

     this.setState({
       rezoom:coordinates,
     })
    
 }

    render() {
      return (
        <div className="container-fluid">
          <div className="col-md-12">
            <div className="col-md-4">
              <div>
                  <img src="img/logo-color.svg" height="300" width="300"/>
                  <div><span className="logo1">e</span><span className="logo2">gress</span></div>
                  <input defaultValue={this.state.zipCode} onChange={this.addZip} className="input"/><br></br>
                  <button type="button" className="btn btn-success center-align" onClick={this.caputureZipData}>SEARCH ZIP</button>
              </div>
              <div className="text">
                  <h3>As the price of city housing continues to climb, populations are beginning to <span className="logo1small">e</span><span className="logo2small">gress™</span> away from their employers.
                      They have chosen to trade more affordable housing for longer commutes. Enter your employers' zipcode above to compare 
                      the price of housing further out and decide if egression is right for you.</h3>
              </div>
            </div>
            <div className="col-md-8">
            <MapContainer newZip = {this.state.zipCode} 
                         newCity = {this.state.city}
                        newState = {this.state.state}
                         newLong = {this.state.long} 
                          newLat = {this.state.lat}
                         markers = {this.state.markersArray}
                            zoom = {this.state.rezoom}
            />
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default App;