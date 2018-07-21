var baseUrl = 'http://fbinter.stadt-berlin.de/fb/wfs';
var folderOptions = ['data', 'geometry'];
var wfsOptions = ['senstadt'];

var generateWFSUrlOptions = function(layerName) {
  const results = [];
  folderOptions.forEach(function(folder) {
    wfsOptions.forEach(function(wfsOption) {
      results.push(baseUrl+'/'+folder+'/'+wfsOption+'/'+layerName);
    });
  });
  return results;
}

module.exports = {
  generateWFSUrlOptions: generateWFSUrlOptions
}
