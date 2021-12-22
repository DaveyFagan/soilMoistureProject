"use strict";

const logger = require("../utils/logger");
require('dotenv').config()


const video = {
    index(request, response) {

      const streamSite =  process.env.DB_STREAM_WEBSITE;
      const stream = `${streamSite}/?action=stream`
      logger.info("video rendering");
      const viewData = {
        title: "Streaming Page",
        stream: stream
      };
      response.render("video", viewData);
    },
  };
  
  module.exports = video;
  