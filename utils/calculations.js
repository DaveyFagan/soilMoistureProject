"use strict";

const logger = require('../utils/logger');
const axios = require('axios').default;


const calculations = {

    getSoilMoisture(soilMoisture){
    if(soilMoisture == -2){
        return 'Dry';
    } 
    else return 'Wet';
    },

    getTempF(temperatureC){
        return temperatureC * 1.8 + 32;
    },

};

module.exports = calculations;