/*
README
Customizing a form bridge to get location information on a smartphone for a kintone app with OpenStreetMap visualization customization.
Getting the location where the map elements are displayed is not so good, so the program needs to be modified accordingly.

Setup:
In the formbridge administration screen, specify the following JavaScript for PC.
https://js.kintone.com/jquery/3.4.1/jquery.min.js
https://unpkg.com/leaflet@1.7.1/dist/leaflet.js

In the kintone administration screen, specify the following CSS for PC.
https://unpkg.com/leaflet@1.7.1/dist/leaflet.css

参考URL
https://qiita.com/TakeshiNickOsanai/items/783caa9f31bcf762da16
https://kita-note.com/leaflet-tutorial-5
*/


(function() {
  "use strict";

  // Use the "fb.events.form.mounted event" because we need to get the <a> element after the DOM of the form has been generated

  fb.events.form.mounted = [function (state) {

    // If the map is already displayed, delete it once.
    if ($('div#kintone').length > 0) {
      $('div#kintone').remove();
    }

    // Positioning for inserting the map. Needs to be improved as the number of <a> elements in the form changes and the location changes.
    var a = document.getElementsByTagName("a");
    // console.log(a);

    // Insert a <div> element into the form

    var mapSpace = document.createElement('div');
    mapSpace.style.height = '450px';
    mapSpace.style.width = '100%';
    mapSpace.style.padding = '25px';
    mapSpace.style.margin = '25px';
    mapSpace.setAttribute('id', 'kintone');

    // Insert a map before the second <a> element.

    a[1].parentNode.insertBefore(mapSpace, a[1]);


    // Set the Tokyo Metropolitan Government as the default location. It can be changed.
    var referencePointGPS = [35.6896, 139.6921]; // Change if needed.
    var kintoneMap = L.map('kintone').setView(referencePointGPS, 18);

    // Set the map layer for OSM.
    var geo_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 19
    });


    // Insert the map layer for OSM.
    geo_layer.addTo(kintoneMap);

    // Register an event when location information is successfully acquired.
    function onLocationFound(e) {
      L.marker(e.latlng).addTo(kintoneMap).bindPopup("Current Location").openPopup();
      // Change the value of a field in the form bridge
      state.record.Lat.value = e.latlng['lat'];
      state.record.Lng.value = e.latlng['lng'];
    }
    kintoneMap.on('locationfound', onLocationFound);

    // Register an event when location information acquisition fails.
    function onLocationError(e) {
      alert("Could not get current location." + e.message);
    }
    kintoneMap.on('locationerror', onLocationError);

    //Execute Geolocation API

    kintoneMap.locate({setView: true, maxZoom: 19, timeout: 20000});

    // Change the center position of the map.
    // Display the cross mark in the center of the map
    // The source of the crosshairs is the Geospatial Information Authority of Japan.

    var crossIcon = L.icon({
      iconUrl: 'https://maps.gsi.go.jp/portal/sys/v4/symbols/092.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Register and display the center cross image.

    var crossMarker = L.marker( kintoneMap.getCenter(),{
      icon:crossIcon,
      zIndexOffset:1000,
      interactive:false
    }).addTo(kintoneMap);

    // Move the center cross with formbridge's movend event and change the field value.

    kintoneMap.on('moveend', function(e) {
      crossMarker.setLatLng( kintoneMap.getCenter());
      state.record.Lat.value = kintoneMap.getCenter().lat;
      state.record.Lng.value = kintoneMap.getCenter().lng;

    });

    return state;
  }];


  // Display a map on the confirmation screen to confirm that the map has been marked correctly.

  fb.events.confirm.created = [function (state) {

    // If the map is already displayed, delete it once.
    if ($('div#kintone').length > 0) {
      $('div#kintone').remove();
    }

    // Positioning to insert a map. Needs to be improved because the location changes when the number of <d> elements in the form changes.
    var d = document.getElementsByTagName("div");

    // Insert a <div> element into the form

    var mapSpace = document.createElement('div');
    mapSpace.style.height = '400px';
    mapSpace.style.width = '95%';
    mapSpace.style.padding = '0px';
    mapSpace.style.margin = '10px';
    mapSpace.setAttribute('id', 'kintone');

    // Insert a map before the second <a> element.

    d[3].parentNode.insertBefore(mapSpace, d[3]);

    var referencePointGPS = [state.record.Lat.value, record.Lng.value];
    var kintoneMap = L.map('kintone').setView(referencePointGPS, 18);

    // Set the OSM map layer
    var geo_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 20
    });

    // Insert the OSM map layer
    geo_layer.addTo(kintoneMap);

    // Insert the marker
    L.marker([state.record.Lat.value, record.Lng.value]).addTo(kintoneMap).bindPopup("発生箇所").openPopup();

    return state;
  }];

})();
