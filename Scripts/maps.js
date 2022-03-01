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

