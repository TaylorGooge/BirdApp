function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
    }


window.onload = function() {

  fetch('/getUserID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email : email} ) 
    })
    .then(response => {
      if(!response.ok){
        throw new Error(`Request failed with status ${response.status}`)
      }
    })



};

