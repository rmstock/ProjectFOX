// This is the connection link to the backend. (Not working right now)
const JSONDATA = "/ProjectFOX/javascript/prototype.json";
getData(JSONDATA);

// Send JsonData
function getData(data) {
    /*fetch(data)
        .then(response => response.json())
        .then(function (data) {
        console.log('Json object from getData function:');
        console.log(data);
        makeTable(data);
    })
        .catch(error => console.log('There was an error: ', error))*/
} // end getData function

// Insert Table of Tracks Data. (Not working right now)
function makeTable(data) {
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
function KILLActive() {
    document.getElementById("KILL2").style.backgroundColor = "green";
    document.getElementById("KILL2").style.color = "black";
}

// This works. When the pilot clicks the fix button, it turns that tracks fix button yellow. We need to relay this to the backend still. Need the tracks ID to sync with Fix# ID so only that one track button changes color.
function FIXActive() {
    document.getElementById("FIX1").style.backgroundColor = "yellow";
    document.getElementById("FIX1").style.color = "black";
}

// Add a listener for a row
function addListenersTableRows(row) {
    window.addEventListener('load', function(e){
        var doc = document.getElementById(row);
        var startx = 0;
        var dist = 0;
        doc.addEventListener('touchstart', function(e) {
            var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
            startx = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
            e.preventDefault();
        }, false);
        doc.addEventListener('touchmove', function(e) {
            var touchobj = e.changedTouches[0]; // reference first touch point for this event
            dist = parseInt(touchobj.clientX) - startx;
            fadeWithSwipe(doc, dist);
            e.preventDefault();
        }, false);
        doc.addEventListener('touchend', function(e) {
            doc.style.backgroundColor = "black";
            var touchobj = e.changedTouches[0]; // reference first touch point for this event
            dist = parseInt(touchobj.clientX) - startx;
            if(dist > 200) {
              pinRowSwipe(row);
            } else if (dist < -200) {
              deleteRowSwipe(doc);
            }
            e.preventDefault();
        }, false);
    }, false);
}

// TODO
// this should be dynamically created
// and newly created when a new row is added
addListenersTableRows('table-row-1');
addListenersTableRows('table-row-2');
addListenersTableRows('table-row-3');
addListenersTableRows('table-row-4');
addListenersTableRows('table-row-5');

// Transition the color as user swipes
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

// Swipe left to delete row
function deleteRowSwipe(row) {
    row.parentNode.removeChild(row);
}

// Click on trash can to delete rows
function deleteRowClick(button) {
    deleteRowSwipe(button.parentNode.parentNode);
}

function pinRowSwipe(rowID) {
    pinRowClick(rowID.replace('table-row', 'pin-button'));
}

// Click on push pin to pin row
function pinRowClick(clickedID) {
    document.getElementById(clickedID).classList.toggle("pinned");
}
