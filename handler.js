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

var getInfoHandler = async (event) => {
  const layerName = event['layer_name'];
  let info;
  try {
    if (event['url']) {
      info = await getWFSInfo(event['url']);
    } else {
      info = await tryOutOptionsForLayerName(layerName);
    }
  } catch (err) {
      console.log(err);
      return err;
  }
  return(createResponse(info));
};

var getDownloadHandler = async (event) => {
  const layerName = event['layer_name'];
  const layerTypeName = event['layer_type'];
  let result;
  try {
    result = await downloadGeoJson(layerName, layerTypeName);
  }
  catch (err) {
      console.log(err);
      return err;
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment;filename='+layerName+'.geojson' },
    body: JSON.stringify(result)
  }
};

module.exports = {
  getInfo: getInfoHandler,
  download: getDownloadHandler
}
