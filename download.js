var wfs = require('wfs_query');

var { generateWFSUrlOptions } = require('./utils.js');
const { toShapefile } = require('./convert.js');

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

const generateGeoJsonResponse = async (name, result) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment;filename='+name+'.geojson' },
    isBase64Encoded: false,
    body: JSON.stringify(result)
  }
}

const generateShapefileResponse = async (name, result) => {
  let response;
  console.log('geojson', result);
  try {
    response = await toShapefile(result);
  } catch(e) {
    console.log('error', e)
    return {
      statusCode: 500,
      body: JSON.stringify({error: e, message: 'Somwthign went wrong'}),
      error: e
    };
  }
  console.log('buffer', response)
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment;filename='+name+'.zip' },
    isBase64Encoded: true,
    body: response.toString('base64')
  }
}

module.exports = {
  downloadGeoJson: downloadGeoJson,
  generateGeoJsonResponse: generateGeoJsonResponse,
  generateShapefileResponse: generateShapefileResponse
}
