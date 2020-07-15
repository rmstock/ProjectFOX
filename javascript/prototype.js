// This is the connection link to the backend. (Not working right now)
const JSONDATA = "/ProjectFOX/javascript/prototype.json";
getData(JSONDATA);

// Send JsonData
function getData(data) {
    return; // FUNCTION NOT WORKING RIGHT NOW
    // JUST GOING TO RETURN AND GET BACK TO STUFF THAT WORKS
    fetch(data)
        .then(response => response.json())
        .then(function (data) {
        console.log('Json object from getData function:');
        console.log(data);
        makeTable(data);
    })
        .catch(error => console.log('There was an error: ', error))
} // end getData function

// Insert Table of Tracks Data. (Not working right now)
function makeTable(data) {
    return; // FUNCTION NOT WORKING RIGHT NOW
    // JUST GOING TO RETURN AND GET BACK TO STUFF THAT WORKS
    // Log what is returned
    console.log(data);
    // Build table elements
    // Use a for loop to include the results in list items
    let list = "<tr>";
    for (let i = 0; i <= 3; i++) {
        list += "<td>" + data.Table[i] + "</td>";
        console.log('tracks data:');
        console.log(data.Table[i]);
    }
    list += "</tr>";
    scrollbar.innerHTML = list;
}

// On the menu bar, when you click "All, "High accuracy" etc,
// show only that data. Send page specific data to display function below.
// (Not working right now)
const navbar = document.getElementById("navigation");
navbar.addEventListener("click", function (event) {
    return; // FUNCTION NOT WORKING RIGHT NOW
    // JUST GOING TO RETURN AND GET BACK TO STUFF THAT WORKS
    let content = event.target.innerHTML;
    console.log(content);
    if (content != "ALL") {
        fetch(JSONDATA)
            .then(response => response.json())
            .then(function (data) {
            console.log('Json object from getData function:');
            console.log(data);
            productSpecific(content, data);
        })
            .catch(error => console.log('There was an error: ', error))
    } else {
        const visibleMain = document.getElementById("hideUnhideMain");
        visibleMain.setAttribute("class", "unhideMain")
        const hide = document.getElementById("hideUnhideContent");
        hide.setAttribute("class", "hideContent");
    }
})

// Take target data and put into webpage
// my id is where JSON data gets inserted.
// what goes in is the prototype.json data."menu" of section I want to insert.
function productSpecific(content, data) {
    // Check what it thinks is the target data (object)
    console.log(data[content].menu);
}

// This works. Right now it changes the color of the specific kill button clicked. Each tract will need a specific ID associated with it, so that only that tract is marked killed when the button is clicked. We will also add functionality here to send a message to the backend that this tract was killed so it can be sorted.
function KILLActive(id) {
    document.getElementById(id).style.backgroundColor = "green";
    document.getElementById(id).style.color = "black";
}

// This works. When the pilot clicks the fix button, it turns that tracks fix button yellow. We need to relay this to the backend still. Need the tracks ID to sync with Fix# ID so only that one track button changes color.
function FIXActive(id) {
    document.getElementById(id).style.backgroundColor = "yellow";
    document.getElementById(id).style.color = "black";
}

// When Pin Icon is Click this will add Gold Border to the Task and Move it to the top.
function GoldBorderandPinToTop(id) {
    var rows = document.getElementById("table").rows;
    document.getElementById("unique1").style.outline = "2px solid black"; // Fixs werid outline overlap

    parent = rows[id].parentNode;
    if(document.getElementById(id).style.borderTopColor!='gold' &&
            document.getElementById(id).style.borderBottemColor!='gold') { //Checks to see if outline is already highlighted
        document.getElementById(id).style.borderTopColor='gold';
        document.getElementById(id).style.borderBottomColor='gold';
        document.getElementById(id).style.outline = "2px solid gold";
        parent.insertBefore(rows[id],rows[1]); // This line makes it change the 2 second position because it looks like you have a place holder row at the top for the catorgories.
    } else {
        document.getElementById(id).style.borderTopColor='blue';
        document.getElementById(id).style.borderBottomColor='blue';
        document.getElementById(id).style.outline = null;
        parent.insertBefore(rows[id],rows[rows]); // Unpinning a task will make it move all the way to the bottom and unhighlight its border.
    }
}

// add a listener for a row
function addListenersTableRows(row) {
    var doc = document.getElementById(row);
    // remove the old one before creating a new one
    doc.removeEventListener('click', function(e) {
        doc.removeEventListener('touchstart', null);
        doc.removeEventListener('touchmove', null);
        doc.removeEventListener('touchend', null);
    }, false);
    doc.addEventListener('click', function(e) {
        var feedback = document.getElementById("TOUCH_FEEDBACK"); // DEBUG
        var startx = 0;
        var starty = 0;
        var distx = 0;
        var disty = 0;
        var endx = 0;
        var vpw = window.innerWidth; // viewport width
        doc.addEventListener('touchstart', function(e) {
            var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
            startx = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
            starty = parseInt(touchobj.clientY); // get y position of touch point relative to top edge of browser
            updateTouchFeedback(feedback, startx, distx, endx, starty, disty); // DEBUG
            e.preventDefault();
        }, false);
        doc.addEventListener('touchmove', function(e) {
            var touchobj = e.changedTouches[0]; // reference first touch point for this event
            distx = parseInt(touchobj.clientX) - startx;
            fadeWithSwipe(doc, distx);
            disty = parseInt(touchobj.clientY) - starty;
            scroll(disty);
            updateTouchFeedback(feedback, startx, distx, endx, starty, disty); // DEBUG
            e.preventDefault();
        }, false);
        doc.addEventListener('touchend', function(e) {
            doc.style.backgroundColor = "black";
            document.getElementById("navigation").style.borderBottom = "2px solid darkgray";
            document.getElementById("main-table").style.borderBottom = "2px solid black";
            var touchobj = e.changedTouches[0]; // reference first touch point for this event
            distx = parseInt(touchobj.clientX) - startx;
            endx = startx + distx;
            if(distx > 200) {
                pinRowSwipe(row);
            } else if (distx < -200) {
                deleteRowSwipe(doc);
            } else if ((startx < 80) && (endx < 80) && (distx < 50)) {
                deleteRowSwipe(doc);
            } else if ((startx > (vpw - 80)) && (endx > (vpw - 80)) && (distx < 50)) {
                pinRowSwipe(row);
            }
            updateTouchFeedback(feedback, startx, distx, endx, starty, disty); // DEBUG
            e.preventDefault();
        }, false);
    }, false);
}

// transition the color as user swipes
function fadeWithSwipe(row, distance) {
    var newColor = '#'; // RGB
    var hexString;
    if(distance > 255) {
      distance = 255;
    }
    hexString = Math.abs(distance).toString(16);
    newColor += hexString;
    if(distance > 0) { // yellow if swiping right
      newColor += hexString;
    } else { // red if swiping left
      newColor += '00';
    }
    newColor += '00';
    row.style.backgroundColor = newColor;
}

scroll.prevDist = 0; // "static" var for the previous distance
scroll.prevY = 0; // "static" var for the previous scroll Y
// swipe vertical to scroll
function scroll(distance) {
    if((distance > -10) && (distance < 10)) {
        scroll.prevDist = 0;
    }
    window.scrollBy(0, scroll.prevDist - distance);
    if(scroll.prevY == window.scrollY) {
        if(distance > 0) {
            document.getElementById("navigation").style.borderBottom = "3px solid red";
        } else {
            document.getElementById("main-table").style.borderBottom = "3px solid red";
        }
    } else {
        document.getElementById("navigation").style.borderBottom = "2px solid darkgray";
        document.getElementById("main-table").style.borderBottom = "2px solid black";
    }
    scroll.prevDist = distance;
    scroll.prevY = window.scrollY;
}

// swipe left to delete row
function deleteRowSwipe(row) {
    row.parentNode.removeChild(row);
}

// click on trash can to delete rows
function deleteRowClick(button) {
    deleteRowSwipe(button.parentNode.parentNode);
}

// swipe right to pin row
function pinRowSwipe(rowID) {
    console.log("in the pinner! ");
    pinRowClick(rowID.replace('table-row', 'pin-button'));
}

// click on push pin to pin row
function pinRowClick(clickedID) {
    document.getElementById(clickedID).classList.toggle("pinned");
}

// for DEBUGGING
// get a random number from 0 to (max-1)
function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// for DEBUGGING
// random decimal from 0 to max, converted to a padded string
function getRandomNumberString(max) {
    padding = (max - 1).toString(10).length;
    var num = getRandomNumber(max);
    out = num.toString(10);
    if(out.length < padding) {
        while(out.length < padding) {
            out = "0" + out;
        }
    }
    return out;
}

// update the filters based on what types are in the table
function updateFilters() {
    var table = document.getElementById("filter-table");
    table.innerHTML = '';
    var row;
    var cell;
    for(var i=0;i<10;i++) {
        row = table.insertRow(-1);
        cell = row.insertCell(-1);
        cell.innerHTML = (i*2).toString(10);
    }
    return;
}

// for DEBUGGING but! can use it for coloring accuracy when we get real data
// random accuracy with correct coloring/labeling
function setAccuracy(cell) {
    var type = getRandomNumber(3);
    var accuracy;
    var out;
    switch(type) {
        case 0:
            accuracy = (10 * getRandomNumber(98) + 10);
            out = accuracy.toString(10) + " FT";
            cell.style.color = "green";
            break;
        case 1:
            accuracy = (100 * getRandomNumber(50) + 1000);
            out = accuracy.toString(10) + " FT";
            cell.style.color = "yellow";
            break;
        case 2:
            accuracy = (0.1 * getRandomNumber(40) + 1);
            out = accuracy.toString(10).substring(0,3) + " NM";
            cell.style.color = "red";
            break;
    }
    cell.innerHTML = out;
}

// for DEBUGGING but! we'll able to use this when we are automatically/dynamically creating
// table rows in the future
debug_add_row.counter = 1; // "static" counter var for the table row number
function debug_add_row()
{
    var table = document.getElementById("main-table");
    var row = table.insertRow(-1); // -1 to append to the end of the table
    var cell = row.insertCell(-1);
    cell.innerHTML = getRandomNumberString(24)
        + ":" + getRandomNumberString(60)
        + ":" + getRandomNumberString(60);
    row.style.fontSize = "12px";
    row.style.borderBottomColor = "#00000000";
    row.style.borderRightColor = "#00000000";
    row.style.position = "absolute";
    row.style.paddingLeft = "6vw";
    row.style.paddingTop = "10px";
    row.style.zIndex = "1";
    row = table.insertRow(-1); // -1 to append to the end of the table
    row.setAttribute("id", "table-row-" + debug_add_row.counter.toString(10));
    row.setAttribute("class", "swipe-able-row");
    cell = row.insertCell(-1);
    cell.innerHTML = getRandomNumberString(10);
    cell.style.paddingTop = "30px";
    cell.style.paddingBottom = "10px";
    cell.style.color = "red";
     cell = row.insertCell(-1);
    cell.innerHTML = getRandomNumberString(1000)
        + "/" + getRandomNumberString(100);
    cell = row.insertCell(-1);
    setAccuracy(cell);
    cell = row.insertCell(-1);
    var button = document.createElement("BUTTON");
    button.setAttribute("class", "buttonGroup");
    button.setAttribute("id", "FIX" + debug_add_row.counter.toString(10));
    button.setAttribute("onclick", "FIXActive()");
    button.innerHTML = "FIX";
    button.style.fontWeight = "bold";
    cell.appendChild(button);
    cell = row.insertCell(-1);
    button = document.createElement("BUTTON");
    button.setAttribute("class", "buttonGroup");
    button.setAttribute("id", "KILL" + debug_add_row.counter.toString(10));
    button.setAttribute("onclick", "KILLActive()");
    button.innerHTML = "KILL";
    button.style.fontWeight = "bold";
    cell.appendChild(button);
    addListenersTableRows('table-row-' + debug_add_row.counter.toString(10));
    debug_add_row.counter++;
    updateFilters();
}

// for DEBUGGING
// put some dummy tracks in the table
for(var i=0; i<27; i++) {
    debug_add_row();
}

// for DEBUGGING
// update touch feedback, 'nuff said
function updateTouchFeedback(element, start, distance, end, starty, disty) {
    element.innerHTML = (' ... vpw[' + window.innerWidth.toString(10)
            + '] scrollY[' + window.scrollY.toString(10)
            + ']... touch feedback: startX['
            + start.toString(10) + '] distanceX['
            + distance.toString(10) + '] endX['
            + end.toString(10) + '] startY['
            + starty.toString(10) + '] distanceY['
            + disty.toString(10) + ']');
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
