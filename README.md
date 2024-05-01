# gis_mapping_w4
## Enhanced Earthquake Map 

This is an enhanced version of the previous earthquake visualization of mine (https://github.com/tysong0/gis_mapping_w3) by introducing the historical earthquake statistics by states. Now, one can not only see the location of individual earthquakes and their magnitude, but can also see the relative earthquake dangrousity of the different states of the US (incl. Puerto Rico) and check how many earthquake happened their historically. It is interesting to see that regions that suffer more from earthquakes do tend to have more earthquakes happening there even during the last week. The data is retrieved from a database of NOAA (https://www.ngdc.noaa.gov/hazard/eq-intensity.shtml). 

The inspiration of this webpage still comes from the New Jersey earthquake weeks ago and to keep a higher level of relevancy to NYC, the recent earthquake dataset for this webpage is kept unupdated as the version retrieved from just after the New Jersey quake (easy update can be realized by download and replace the dataset via the USGS website for earthquake updates, https://earthquake.usgs.gov/earthquakes/map/).

## Features
 - Globe view of regions near the US
 - See time and magnitude of individual earthquakes when hover over the displayed earthquake markers on the map
 - Markers are displayed in 3 colors, implying the magnitude intuitively
 - Additional function in this <b>Enhanced Version</b>: Historical earthquake data of US states
 - Click on states on the map to see the historical earthquake statistics in that state
 - Color of the state is associated with the total earthquake count: darker red means more earthquakes have happened there, therefore more dangerous
