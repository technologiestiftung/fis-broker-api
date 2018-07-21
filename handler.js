'use strict';

const { getWFSInfo, tryOutOptionsForLayerName } = require('./info.js');
const { downloadGeoJson } = require('./download.js');

var createResponse = function(info) {
    let response;

    if(info && info.length > 0) {
      response = {
        statusCode: 200,
        body: JSON.stringify(info),
      };
    } else {
      response = {
        statusCode: 400,
        body: 'Somethign went wrong'
      };
    }
    return response;
};

var getInfoHandler = (event, context, callback) => {
  const layerName = event['layer_name'];
  if (event['url']) {
    getWFSInfo(event['url']).then(function(info) {
      callback(null, createResponse(info));
    });
  } else {
    tryOutOptionsForLayerName(layerName).then(function(info) {
      callback(null, createResponse(info));
    });
  }
};
var getDownloadHandler = (event, context, callback) => {
  const layerName = event['layer_name'];
  const layerTypeName = event['layer_type'];
  downloadGeoJson(layerName, layerTypeName).then(function(result) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
    });
  });
};

module.exports = {
  getInfo: getInfoHandler,
  download: getDownloadHandler
}

