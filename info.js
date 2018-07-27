var wfs = require('wfs_query');

var { generateWFSUrlOptions } = require('./utils.js');


var getWFSInfo = function(wfsUrl) {
  return new Promise(function(resolve, reject) {
    try {
      wfs.getInfo(wfsUrl).then(function(result) {
        if(result && result.length > 0) {
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
    generateWFSUrlOptions(layerName).forEach(function(wfsUrl) {
      getWFSInfo(wfsUrl).then(function(result) {
        resolve(result);
      }).catch(function(e) {
      });
    });
  });
};

module.exports = {
  getWFSInfo: getWFSInfo,
  tryOutOptionsForLayerName: tryOutOptionsForLayerName
};
