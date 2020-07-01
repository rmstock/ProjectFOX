//This works. Right now it changes the color of the specific kill button clicked. Each tract will need a specific ID associated with it, so that only that tract is marked killed when the button is clicked. We will also add functionality here to send a message to the backend that this tract was killed so it can be sorted.
function KILLActive(){
    document.getElementById("KILL2").style.backgroundColor = "green";
    document.getElementById("KILL2").style.color = "black";
}

//This works. When the pilot clicks the fix button, it turns that tracks fix button yellow. We need to relay this to the backend still. Need the tracks ID to sync with Fix# ID so only that one track button changes color.
function FIXActive(){
    document.getElementById("FIX1").style.backgroundColor = "yellow";
    document.getElementById("FIX1").style.color = "black";
}

// Click on trash can to delete rows
function deleteRow() {
    document.getElementById("main-table").deleteRow(0);
}

// Click on push pin to pin a row
function pinRow(clickedID) {
    document.getElementById(clickedID).classList.toggle("pinned");
}

//Next two lines ensure the console works.
/*global console*/
/* eslint no-console: "off" */
window.console.log("Hello Team Fox!"); //one way to display
console.log('Console Log appears here if working correctly *!')//this way works too.

//In connecting the backend and frontend for api communication, message control, etc. there are many ways to do this. Using ajax, JQuery, and vanilla javascript. In each case, I am having problems with CORS access-control-allow-origin headers/ preflight requests. Accessing url's runs into security problems.

//Not working attempt one at accessing backend url's
retrieveMessage()
function retrieveMessage(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://127.0.0.1:18080/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json'); //attempt to overcome CORS header issue
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*'); //attempt to overcome CORS header issue
    xhttp.send();
    console.log("At Point A!")
}

//Not working attempt two at accessing backend url's
const proxyurl = "https://cors-anywhere.herokuapp.com/"; //needed to add CORS Access-Control header
const url = "https://127.0.0.1:18080/"; // Link to Richards Backend
getBackendData();
function getBackendData(){
    fetch(proxyurl + url, {
        header: 'origin'
    })
        .then(response => response.json())
        .then(json => console.log(json))
        .then(contents => console.log(contents))
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    console.log('Made it to point B');
}

//Not working attempt three at accessing backend url's
linkBackend();
function linkBackend() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin','http://localhost:3000');
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; //needed to add CORS Access-Control header
    const url = "https://127.0.0.1:18080/"; // Link to Richards Backend

    fetch(proxyurl + url, {
        mode: 'cors',
        credentials: 'omit',
        headers: headers
    })
        .then(response => response.json())
        .then(json => console.log(json))
    console.log('Made it to point C');
}
