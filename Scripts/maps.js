window.onload = function() {
  fetch('/getUserID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email: email} ),
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
      });
  getData('getlogged', 'POST', initMap);
};

function toGeoJson(data) {
  const outGeoJson = {};
  for (let i =0; i < data.length; i++) {
    const coordA = parseFloat(data[i]['coordA']);
    const coordB = parseFloat(data[i]['coordB']);
    outGeoJson['properties'] = data[i];
    outGeoJson['type']= 'Feature';
    outGeoJson['geometry']= {'type': 'Point', 'coordinates':
              [coordA, coordB]};
  }
  return outGeoJson;
}
function getData(endpoint, method, callBack) {
  return fetch(`\ ${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  })
      .then((response) => {
        const data = response.json()
            .then( (data) => {
              const outGeoJson = {
                type: 'FeatureCollection',
                features: [],
              };
              for (let i =0; i < data.length; i++) {
                const coordA = parseFloat(data[i]['coordA']);
                const coordB = parseFloat(data[i]['coordB']);
                let tempObj = {};
                tempObj['properties'] = data[i];
                tempObj['type']= 'Feature';
                tempObj['geometry']= {'type': 'Point', 'coordinates':[coordA, coordB]};
                outGeoJson['features'].push(tempObj)
              }
              callBack(outGeoJson);
            });
      });
}
function initMap(geoData) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.850033, lng: -87.6500523},
    zoom: 5,
  });
  map.data.addGeoJson(geoData);
  map.data.setStyle({
    strokeColor: 'blue'});
  const infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement('button');
  locationButton.textContent = 'Pan to Current Location';
  locationButton.classList.add('custom-map-control-button');
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

  map.data.addListener('click', function(event) {
    const feat = event.feature;
    const html = '<b>' + feat.getProperty('englishName')+ '</b>';
    infoWindow.setContent(html);
    infoWindow.setPosition(event.latLng);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -34)});
    infoWindow.open(map);
  });
  locationButton.addEventListener('click', () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
};
