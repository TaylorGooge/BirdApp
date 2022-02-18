window.addEventListener('load', () => {
    fetch('/getlogged', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email : email,
        }) 
        })
        .then(response => {
          if(!response.ok){
            throw new Error(`Request failed with status ${reponse.status}`)
          }
          let data = response.json()
          console.log(data)
        })
       
})



   
