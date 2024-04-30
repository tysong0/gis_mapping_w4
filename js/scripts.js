var STARTING_CENTER = [-73.26651, 40.79090]
var ZOOM_SW = [-74.87235, 40.19620]
var ZOOM_NE = [-71.66068, 41.38031]
var hoveredPolygonId = null;

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
    zoom: 6.13, // starting zoom
    maxBounds: bounds // Set the map's geographical boundaries.
})

// add a navigation control
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// add a scale to the map
map.addControl(new mapboxgl.ScaleControl());

map.on('load', () => {
    map.resize();

    map.addSource('states', {
        "type": "geojson",
        "data": "data/us_states.geojson"
    });

    // add a fill layer using the PLUTO data
    map.addLayer({
        'id': 'states-fill',
        'type': 'fill',
        'source': 'states',
        'layout': {},
        'paint': {
            'fill-color': { // use an expression for data-driven styling
                property: 'count',
                stops: [[0, '#fff'], [13000, '#f00']]
            },
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1.5,
                0.5
            ]
        }
    });

    //add a line layer for the states
    map.addLayer({
        'id': 'states-line',
        'type': 'line',
        'source': 'states',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 1.5
        }
    }, 'path-pedestrian-label');

    // When the user moves their mouse over the state-fill layer, we'll update the feature state for the feature under the mouse.
    map.on('mousemove', 'states-fill', (e) => {
        if (e.features.length > 0) {
            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    { source: 'states', id: hoveredPolygonId },
                    { hover: false }
                );
            }
            hoveredPolygonId = e.features[0].id;
            map.setFeatureState(
                { source: 'states', id: hoveredPolygonId },
                { hover: true }
            );
        }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'states-fill', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'states', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = null;
    });

    //iterate
    earthquakes.forEach(function (earthquakerecord) {

        var magnitude = earthquakerecord.mag;
        var colour;
        var utcDate = `${earthquakerecord.time}`;  // ISO-8601 formatted date returned from the original dataset
        var localDate = moment(utcDate).format('LL'); // Display in local time, using the moment.js
        var coordinates = [earthquakerecord.longitude, earthquakerecord.latitude];

        //set the color of the markers
        // If the earthquake is more significant than M5.0
        if (magnitude >= 5.0) {
            colour = "red";

            // If the earthquake is between M4.0 and 5.0
        } else if (magnitude >= 4.0) {
            colour = "orange";

            // If the earthquake is more minor than M4.0
        } else {
            colour = "yellow";
        }

        //create popup incl. quake info and stick them on the markers on hover
        const popup = new mapboxgl.Popup({
            offset: 40,
            anchor: 'bottom',
            closeButton: false,
            closeOnClick: false
        }).setHTML(
            `<h3> Earthquake profile: </h3><h4> Magnitude: <b> M${earthquakerecord.mag} </b> <br> Happened on: <b> ${localDate} </b> </h4>`
        );

        //create the markers
        const marker = new mapboxgl.Marker({
            color: colour
        })
            .setLngLat([earthquakerecord.longitude, earthquakerecord.latitude])
            .setPopup(popup)
            .addTo(map);
        const markerDiv = marker.getElement();
        markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
        markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
    })

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

    // When a click event occurs on a feature in the states layer,
    // open a popup at the location of the click, with description
    // HTML from the click event's properties.
    map.on('click', 'states-fill', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3> State profile: </h3><h4> In <b> ${e.features[0].properties.name} </b>, ${e.features[0].properties.count} earthquakes happened during 1638 to 1985. </h4>`)
            .addTo(map);
    });

    // Change the cursor to a pointer when
    // the mouse is over the states layer.
    map.on('mouseenter', 'states-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back to a pointer
    // when it leaves the states layer.
    map.on('mouseleave', 'states-fill', () => {
        map.getCanvas().style.cursor = '';
    });





});
