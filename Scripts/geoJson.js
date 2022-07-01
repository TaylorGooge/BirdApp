function toGeoJson(data) {
  const outGeoJson = {};
  for (let i =0; i < data.length; i++) {
    console.log(data[i]['coordA']);
    outGeoJson['properties'] = data[i];
    outGeoJson['type']= 'Feature';
    outGeoJson['geometry']= {'type': 'Point', 'coordinates':
    [data[i]['coordA'], data[i]['coordB']]};
  }
  return outGeoJson;
}
