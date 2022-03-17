/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
window.addEventListener('load', () => {
  getLogged();
});

function convertDate(date) {
  // sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
  const sqlDateArr1 = date.split('-');
  // format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
  const sYear = sqlDateArr1[0];
  const sMonth = (Number(sqlDateArr1[1]) - 1).toString();
  const sqlDateArr2 = sqlDateArr1[2].split('T');
  // format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
  const sDay = sqlDateArr2[0];
  return new Date(sYear, sMonth, sDay);
}

function getLogged() {
  fetch('/getlogged', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`);
        }
        response.json().then((data) => {
          const table = document.getElementById('birdList');
          table.innerHTML = '';
          const range = 3;
          for ( const property in data) {
            const delButton = '<button class=\'btn btn-light\' onclick= \'deleteThis(this.parentNode.parentNode)\'>Delete</button>';
            const attributeVal = [`${data[property].englishName}`, convertDate(data[property].date), delButton];
            const row = document.createElement('tr');
            row.setAttribute('id', `${data[property].id} ${data[property].userID} ${data[property].birdId}`);
            for (let i=0; i< range; i ++) {
              const col = document.createElement('td');
              col.innerHTML = attributeVal[i];
              row.appendChild(col);
            }
            table.appendChild(row);
          }
        });
      });
}


