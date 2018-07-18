'use strict';

var wfs = require('wfs_query');

var baseUrl = 'http://fbinter.stadt-berlin.de/fb/wfs';
var folderOptions = ['data', 'geometry'];
var wfsOptions = ['senstadt'];


var getWFSInfo = function(wfsUrl) {
  return new Promise(function(resolve, reject) {
    try {
      wfs.getInfo(wfsUrl).then(function(result) {
        if(result) {
          result.url = wfsUrl;
          resolve(result);
        }
      }).catch(function(e) {
        console.log(e);
      });
    } catch(e) {
      console.log(e);
    }
  });
};

var tryOutOptionsForLayerName = function(layerName) {
  return new Promise(function(resolve, reject) {
    folderOptions.forEach(function(folder) {
      wfsOptions.forEach(function(wfsOption) {
        var wfsUrl = baseUrl+'/'+folder+'/'+wfsOption+'/'+layerName;
        getWFSInfo(wfsUrl).then(function(result) {
          resolve(result);
        }).catch(function(e) {
        });
      });
    });
  });
};

var createResponse = function(info) {
    let response;

    if(info && info.layerName) {
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

module.exports.getInfo = (event, context, callback) => {
  const layerName = event['layer_name'] || event['pathParameters']['layer_name'];
  if (event['url']) {
    getWFSInfo(event['url']).then(function(info) {
      callback(null, createResponse(info));
    });
  }else {
    tryOutOptionsForLayerName(layerName).then(function(info) {
      callback(null, createResponse(info));
    });
  }
};
