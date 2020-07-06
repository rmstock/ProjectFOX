
// Global vars to cache event state
var evCache = new Array();
var prevDiff = -1;

//global scale var
var scale = 1;

// Testing mode flag
var testingTouch = false;

//check to see if the mouse is over the map
var mouse = false;

function init() {
	// Install event handlers for the pointer target
	var el=document.getElementById("target");
	el.onpointerdown = pointerdown_handler;
	el.onpointermove = pointermove_handler;

	// Use same handler for pointer{up,cancel,out,leave} events since
	// the semantics for these events - in this app - are the same.
	el.onpointerup = pointerup_handler;
	el.onpointercancel = pointerup_handler;
	el.onpointerout = pointerup_handler;
	el.onpointerleave = pointerup_handler;

	document.addEventListener("keydown", keyListener);
}

function mouseStatus(mouseBool){
	mouse = mouseBool;
	//if the map has been left, reset scale to 1
	if(!mouse){
		scale= 1;
	}
}

function keyListener(e){
	console.log(e.code);
	if(e.code == 'KeyW' && mouse && scale < 4){
		console.log("Zooming in");
		scale += .5;
		document.getElementById("target").children[0].style.transform = "Scale(" + scale + ")";
	}
	else if(e.code == 'KeyS' && mouse && scale > 1){
		console.log("Zooming out");
		scale -= .5;
		document.getElementById("target").children[0].style.transform = "Scale(" + scale + ")";
	}
}

function changeTesting(){
	testingTouch = testingTouch ? false : true;
	document.getElementById("changetesting").innerHTML = testingTouch ? "Change to Mouse Testing" : "Change to Gesture Testing";
}

function pointerdown_handler(ev) {
	// The pointerdown event signals the start of a touch interaction.
	// This event is cached to support 2-finger gestures
	evCache.push(ev);
	log("pointerDown", ev);
}

function pointermove_handler(ev) {
	// This function implements a 2-pointer horizontal pinch/zoom gesture, it needs to be updated in the future to bring in the y values 
	// If the distance between the two pointers has increased,zoom in. 
	// If the distance is decreasing, zoom out. So far the only way to test the pinch gesture is with logging 
	// It also has the mouse functionality, which I think contains a lot of the math needed to implement the zoom with pinching
	// I just didn't have the time to try to put them together, to the best of my knowledge this should work with a canvas element as well

	log("pointerMove", ev);
	var x = ev.pageX;
	var y = ev.pageY;

	// Find this event in the cache and update its record with this event
	for (var i = 0; i < evCache.length; i++) {
		if (ev.pointerId == evCache[i].pointerId) {
		  evCache[i] = ev;
		break;
		}
	}

	if(!testingTouch){
		//These lines allow for scrolling the zoomed image
		var xPercentage = Math.abs((x/350) * 100);
		var yPercentage = Math.abs((y/500) * 100);
		document.getElementById("target").children[0].style.transformOrigin = xPercentage + "%" + yPercentage + "%";
	}

	else{
		// If two pointers are down, check for pinch gestures
		if (evCache.length == 2) {
			// Calculate the distance between the two pointers
			var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);

			if (prevDiff > 0) {
				if (curDiff > prevDiff) {
					// The distance between the two pointers has increased
					log("Pinch moving OUT -> Zoom in", ev);
				}
				if (curDiff < prevDiff) {
					// The distance between the two pointers has decreased
					log("Pinch moving IN -> Zoom out",ev);
				}
			}

			// Cache the distance for the next move event 
			prevDiff = curDiff;
		}
	}
}

function pointerup_handler(ev) {
	log(ev.type, ev);
	// Remove this pointer from the cache and reset the target's
	// background and border
	remove_event(ev);
	document.getElementById("target").children[0].style.transform = "Scale(1)";

	// If the number of pointers down is less than two then reset diff tracker
	if (evCache.length < 2) {
		prevDiff = -1;
	}
}

function remove_event(ev) {
	// Remove this event from the target's cache
	for (var i = 0; i < evCache.length; i++) {
		if (evCache[i].pointerId == ev.pointerId) {
			evCache.splice(i, 1);
			break;
		}
	}
}

//These functions are used to send event activity to the applications window

// Log events flag
var logEvents = false;

// Logging/debugging functions
function enableLog(ev) {
  logEvents = logEvents ? false : true;
}

function log(prefix, ev) {
  if (!logEvents) return;
  var o = document.getElementsByTagName('output')[0];
  var s = prefix + ": pointerID = " + ev.pointerId +
                " ; pointerType = " + ev.pointerType +
                " ; xPosition = " + ev.pageX + 
                " ; yPosition = " + ev.pageY + "<br/>"; 
  o.innerHTML += s + "";
} 

function clearLog(event) {
 var o = document.getElementsByTagName('output')[0];
 o.innerHTML = "";
}


