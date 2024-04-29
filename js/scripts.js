var STARTING_CENTER = [-73.26651, 40.79090]
var ZOOM_SW = [-74.87235, 40.19620]
var ZOOM_NE = [-71.66068, 41.38031]

// Set max zoom out bounds to the US
const bounds = [
    [-144.75460, 10.14845], // Southwest coordinates
    [-44.18682, 60.65736] // Northeast coordinates
];

//introduce the map
mapboxgl.accessToken = 'pk.eyJ1IjoidGlhbnlzb25nIiwiYSI6ImNsdWx1OGVodzBqcWwyaW9hOW1oaWRnOWwifQ.E4RNl8ESZulQlGSzXECAMw';
const map = new mapboxgl.Map({
    container: 'container', // container ID
    center: STARTING_CENTER, // starting position [lng, lat]
    style: 'mapbox://styles/mapbox/outdoors-v12',
    zoom: 8.13, // starting zoom
    maxBounds: bounds // Set the map's geographical boundaries.
})

map.on('load', function () {
    map.resize();
});

//iterate
earthquakes.forEach(function(earthquakerecord) {
   
    var magnitude = earthquakerecord.mag; 
    var colour;
    var utcDate = `${earthquakerecord.time}`;  // ISO-8601 formatted date returned from the original dataset
    var localDate = new Date(utcDate);  // Display in local time

    //set the color of the markers
    // If the earthquake is more significant than M5.0
    if (magnitude >= 5.0) {
      colour = "red";
    
    // If the earthquake is between M4.0 and 5.0
    } else if (magnitude >= 4.0 ) {
      colour = "orange";
    
    // If the earthquake is more minor than M4.0
    } else {
      colour = "yellow";
    }

    //create popup incl. quake info and stick them on the markers
    const popup = new mapboxgl.Popup({ 
        offset: 40,
        anchor: 'bottom'
    }).setText(
        `There was a M${earthquakerecord.mag} earthquake, happened at ${localDate}.`
    );

    //create the markers
    new mapboxgl.Marker({ 
    color: colour 
    })
    .setLngLat([earthquakerecord.longitude, earthquakerecord.latitude])
    .setPopup(popup)
    .addTo(map);
})

// add a scale to the map
map.addControl(new mapboxgl.ScaleControl());

/*
     *  When a user clicks the button, `fitBounds()` zooms and pans
     *  the viewport to contain a bounding box that surrounds Kenya.
     *  The [lng, lat] pairs are the southwestern and northeastern
     *  corners of the specified geographical bounds.
     */
document.getElementById('fit').addEventListener('click', () => {
    map.fitBounds([
        ZOOM_SW, // southwestern corner of the bounds
        ZOOM_NE // northeastern corner of the bounds
    ]);
});





