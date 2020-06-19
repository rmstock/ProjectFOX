//This is the connection link to the backend. (Not working right now)
const JSONDATA = "/ProjectFOX/javascript/prototype.json";
getData(JSONDATA);


//send JsonData
function getData(data) {
    fetch(data)
        .then(response => response.json())
        .then(function (data) {
        console.log('Json object from getData function:');
        console.log(data);
        makeTable(data);
    })
        .catch(error => console.log('There was an error: ', error))
} // end getData function

//Insert Table of Tracks Data. (Not working right now)
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
    };
    list += "</tr>";
    scrollbar.innerHTML = list;
}


//On the menu bar, when you click "All, or "high accuracy" etc, show only that data. Send page specific data to display function below. (Not working right now)

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


//Take target data and put into webpage
//my id is where JSON data gets inserted.
//what goes in is the prototype.json data."menu" of section I want to insert.
function productSpecific(content, data) {

    //check what it thinks is the target data (object)
    console.log(data[content].menu);

}

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

//This does not work yet. I was messing with some GUI gestures, but haven't figured it out yet.
function SwipeLeftAction() {
    document.getElementById("unique1").style.display = "none";
}
