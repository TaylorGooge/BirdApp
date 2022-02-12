window.addEventListener('load', () => {
    // block below gets all vendor ids, calls a function to build the vendor id dropdowns, and calls 
    // a similiar function for all item ids.
    let req = new XMLHttpRequest()
    req.open("GET", "/getbirds", true);
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var res = JSON.parse(req.responseText);
            buildBirdDropDown(res)
          
        } else {
            //showModal("Task Failed", "There was a problem fetching Suppliers")
            return
        }
    })
    req.send()

    document.getElementById('submitBird').addEventListener('click', function(e){
        e.preventDefault();
        if (document.getElementById("birdName").value == '0'){
            return
        }
        recordBird()
    
    })
})

function buildBirdDropDown(data){
    // this function builds the vendor id dropdowns

    let dropDowns = document.getElementById('birdName')
    for (let i=0; i < data.length; i++){
        let opt = document.createElement('option')
        opt.innerText = data[i].englishName + " " + data[i].fourCode + " " + data[i].scientificName + " " + data[i].sixCode;
        opt.setAttribute('value', data[i].birdID)
        dropDowns.appendChild(opt)
    }
}

function recordBird(){
    alert('called')
    ////get location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log(position)
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
   
}

