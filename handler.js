'use strict';

const { getWFSInfo, tryOutOptionsForLayerName } = require('./info.js');
const { downloadGeoJson } = require('./download.js');

const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 300,
});
    
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

var createResponse = function(info) {
    let response;

    if(info && info.length > 0) {
      response = {
        headers:headers,
        statusCode: 200,
        body: JSON.stringify(info)
      };
    } else {
      response = {
        headers:headers,
        statusCode: 400,
        body: 'Something went wrong'
      };
    }
    return response;
};

var getInfoHandler = async (event) => {

  const layerName = event['layer_name'] || event.headers['layer_name'];
  let info;

  try {
    await rateLimiter.consume(('requestContext' in event) ? event.requestContext.identity.sourceIp : "USER_TOKEN", 1);
  } catch (rejRes) {
    return {
      statusCode: 429,
      body: JSON.stringify({message: 'Too Many Requests'})
    }
  }

  let url = false;
  if('url' in event) url = event.url;
  if(('headers' in event) && ('url' in event.headers)) url = event.headers.url

  try {
    if (url) {
      info = await getWFSInfo(url);
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
  const layerName = event['layer_name'] || event.headers['layer_name'];
  const layerTypeName = event['layer_type'] || event.headers['layer_type'];
  let result;

  try {
    await rateLimiter.consume(('requestContext' in event) ? event.requestContext.identity.sourceIp : "USER_TOKEN", 5);
  } catch (rejRes) {
    return {
      statusCode: 429,
      body: JSON.stringify({message: 'Too Many Requests'})
    }
  }

  try {
    result = await downloadGeoJson(layerName, layerTypeName);
  }
  catch (err) {
      console.log(err);
      return err;
  }

  return {
    statusCode: 200,
    headers: {...headers, 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment;filename='+layerName+'.geojson' },
    body: JSON.stringify(result)
  }
};

module.exports = {
  getInfo: getInfoHandler,
  download: getDownloadHandler
}
