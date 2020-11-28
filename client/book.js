
let avflights = []
const setflights= (data) => {
  avflights = data;
}

async function search() {
  console.log("#searching")
  // read the avflight description from input
  //const origin = document.querySelector('#origin_city').value;
  //const destination = document.querySelector('#destination_city').value;
  //const connection = document.querySelector('#conn').value;
  //const no_pass = document.querySelector('#pass_no').value;
  //console.log(origin);-->

  // use try... catch... to catch error
  try {

    // insert new avflight to "http://localhost:5000/avflights", with "POST" method
    const response = await fetch("http://localhost:1385/avflights");
    const jsonData = await response.json();
    // refresh the page when inserted
    setflights(jsonData)
    displayavflights();
    document.body.innerHTML += `<br><tbody>${avflights[0].origin}</tbody></br>`;
    //location.reload();

  } catch (err) {
    console.log(err.message);
  }
}

const displayavflights = () => {
  

}