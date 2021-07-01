document.getElementById("getbuilding").addEventListener('click', getData);

function getData(){
    let query = document.getElementById("textin").value;
    let data = {'building_code' :query};
    let options = {
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        },
        dataType:'json'
    }
    fetch('/getPhoto', options)
    .then(response => response.json())
    .then(info => console.log(info.data[0].img_file));
    
}