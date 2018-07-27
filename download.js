var wfs = require('wfs_query');

var { generateWFSUrlOptions } = require('./utils.js');

var downloadGeoJson = function(layerName, typeName) {
  return new Promise(function(resolve, reject) {
    generateWFSUrlOptions(layerName).forEach(function(wfsUrl) {
      wfs.getFeature(wfsUrl, typeName, 'application/json').then(function(result) {
        resolve(result);
      }).catch(function(e) {
      });
    });
  });
};

module.exports = {
  downloadGeoJson: downloadGeoJson
}
