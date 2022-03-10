window.addEventListener('load', () => {
  getLogged()
})

function convertDate (date){
      //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
      var sqlDateArr1 = date.split("-");
      //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
      var sYear = sqlDateArr1[0];
      var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
      var sqlDateArr2 = sqlDateArr1[2].split("T");
      //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
      var sDay = sqlDateArr2[0];
      return new Date(sYear,sMonth,sDay);
}

function deleteThis(object){
  let id = object.id
  id =  id.split(" ")
  id = id[0]


  fetch('/deleteEntry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id
    }) 
    })
    .then(response => {
      if (response.status == 200) {
        getLogged()
      }
  })
}

function getLogged() {
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
      response.json().then(data => {

          let table = document.getElementById('birdList')
          table.innerHTML = ""
          let range = 4
          for( const property in data) {
            let delButton = "<button class='btn btn-light' onclick= 'deleteThis(this.parentNode.parentNode)'>Delete</button>"
            let updateButton = "<button class= 'btn btn-light' onclick= 'updateThis(this.parentNode.parentNode)'>Update</button>"
            let attributeVal = [`${data[property].englishName}`, convertDate(data[property].date), updateButton, delButton]
            let row = document.createElement('tr')
            row.setAttribute('id', `${data[property].id} ${data[property].userID} ${data[property].birdId}`)
            for (let i=0; i< range; i ++){
              let col = document.createElement('td')
              col.innerHTML = attributeVal[i]
              row.appendChild(col)
            }
            table.appendChild(row)
          }
      })
    })

}



   
