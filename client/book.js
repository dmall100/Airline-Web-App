
let avflight = []
let count = 0
const setflights = (data) => {
  avflight[count] = data;
  count = count + 1; 
}
async function search() {
    // read the avflight description from input
    const origin = document.querySelector('#origin_city').value;
    const destination = document.querySelector('#destination_city').value;
    const connection = document.querySelector('#conn').value;
    const no_pass = document.querySelector('#pass_no').value;
    console.log(origin);
  
    // use try... catch... to catch error
    try {
  
      // insert new avflight to "http://localhost:5000/avflights", with "POST" method
      const body = { description: origin };
      const response = await fetch("http://localhost:1385/search", {
        method: "SEARCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const jsonData = await response.json();
      console.log(jsonData)
      displayavflights(jsonData);
      // refresh the page when inserted
      location.reload();
      return false;
  
    } catch (err) {
      console.log(err.message);
    }
}

const displayavflights = (data) => {
  const avflightTable = document.querySelector('#avflight-table');

  // display all avflights by modifying the HTML in "avflight-table"
  let tableHTML = "";
  avflights.map(avflight =>{
    tableHTML +=
    `<tr key=${avflight.avflight_id}>
    <th>${avflight.origin}</th>
    <th><button class="btn btn-warning" type="button" data-toggle="modal" data-target="#edit-modal" onclick="editavflight(${avflight.origin})">Edit</button></th>
    <th><button class="btn btn-danger" type="button" onclick="deleteavflight(${avflight.origin})">Delete</button></th>
    </tr>`;
  })
  avflightTable.innerHTML = tableHTML;

}