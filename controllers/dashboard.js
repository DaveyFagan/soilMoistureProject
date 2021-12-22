"use strict";

require('dotenv').config()
const logger = require("../utils/logger");
const axios = require('axios').default;
const calculations = require('../utils/calculations.js');

const dashboard = {
 async index(request, response) {
    logger.info("dashboard rendering");
    
    const channelId =  process.env.DB_CHANNEL_ID;
    const apiKey = process.env.DB_API_KEY;
    const requestUrl = `https://api.thingspeak.com/channels/${channelId}/feeds/last.json?api_key=${apiKey}&status=true`;
    const result = await axios.get(requestUrl);    
    const temperature = result.data.field1;
    const humidity = result.data.field2;
    const pressure = result.data.field3;
    const soilMoistureValue = result.data.field4;
    const soilMoisture = calculations.getSoilMoisture(soilMoistureValue)
    const tempF = calculations.getTempF(temperature);
    console.log("Temperature is: " + temperature);
    console.log("Humidity is: " + humidity);
    console.log("Pressure is: " + pressure);
    console.log("Soil Moisture is: " + soilMoisture);
    console.log("Temperature in fahrenheit is: " + tempF);
  

    //graphs
    const tempGraph = `https://thingspeak.com/channels/${channelId}/charts/1?api_key=${apiKey}&bgcolor=%23ffffff&color=%23d62020&width=850&dynamic=true&results=60&title=Temperature+Measurement&type=line`;
    const humGraph =`https://thingspeak.com/channels/${channelId}/charts/2?api_key=${apiKey}&bgcolor=%23ffffff&color=%23d62020&width=850&dynamic=true&results=60&title=Humidity+Measurement&type=line`;
    const pressGraph =`https://thingspeak.com/channels/${channelId}/charts/3?api_key=${apiKey}&bgcolor=%23ffffff&color=%23d62020&width=850&dynamic=true&results=60&title=Pressure+Measurement&type=line`;
    const soilGraph =`https://thingspeak.com/channels/${channelId}/charts/4?api_key=${apiKey}&bgcolor=%23ffffff&color=%23d62020&width=850&dynamic=true&results=60&title=Soil+Wet%2FDry&type=line`;

    //last 5 temp readings
    const tempDataUrl =`https://api.thingspeak.com/channels/${channelId}//fields/1.json?api_key=${apiKey}&results=5`;
    const result1 = await axios.get(tempDataUrl);
    let tempReadings = [];
    if(result.data.field1.length > 0){
    for(let i = 0; i <5; i++){
        tempReadings.push(result1.data.feeds[i].field1);
    }
    tempReadings.reverse();
    console.log(tempReadings);
  }

    //last 5 time readings
    let timeReadings = [];
    if(result.data.field1.length > 0){
    for(let i=0; i<5; i++){
    timeReadings.push(result1.data.feeds[i].created_at)
    }
    timeReadings.reverse();
    console.log(timeReadings);
  }

    //Last 5 humidity readings
    const humDataUrl =`https://api.thingspeak.com/channels/${channelId}/fields/2.json?api_key=${apiKey}&results=5`;
    const result2 = await axios.get(humDataUrl);
    let humReadings = [];
    if(result.data.field2.length > 0){
    for(let i = 0; i <5; i++){
        humReadings.push(result2.data.feeds[i].field2);
    }
    humReadings.reverse();
    console.log(humReadings);
  }

    //last 5 pressure readings
    const pressDataUrl =`https://api.thingspeak.com/channels/${channelId}/fields/3.json?api_key=${apiKey}&results=5`;
    const result3 = await axios.get(pressDataUrl);
    let pressReadings = [];
    if(result.data.field3.length > 0){
    for(let i = 0; i <5; i++){
        pressReadings.push(result3.data.feeds[i].field3);
    }
    pressReadings.reverse();
    console.log(pressReadings);
    console.log(result3.data.feeds[0]);
  }
    //last 5 soil moisture readings
    const soilDataUrl =`https://api.thingspeak.com/channels/${channelId}/fields/4.json?api_key=${apiKey}&results=5`;
    const result4 = await axios.get(soilDataUrl);
    let soilReadings = [];
    if(result.data.field4.length > 0){
    for(let i = 0; i <5; i++){
        soilReadings.push(result4.data.feeds[i].field4);
    }
    soilReadings.reverse();
    }

    const viewData = {
      title: "Plant Watering System",
      temperature: temperature,
      humidity: humidity,
      pressure: pressure,
      soilMoisture: soilMoisture,
      tempF: tempF,
      tempGraph: tempGraph,
      humGraph: humGraph,
      pressGraph: pressGraph,
      soilGraph: soilGraph,
      tempReadings: tempReadings,
      timeReadings: timeReadings,
      humReadings: humReadings,
      pressReadings: pressReadings,
      soilReadings: soilReadings,
    };
    response.render("dashboard", viewData);
  },
};

module.exports = dashboard;


   
   