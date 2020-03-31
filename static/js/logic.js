// Store our   endpoint inside queryUrl
// Visit the USGS GeoJSON Feed page and pick a data set - for example 'All Earthquakes from the Past 7 Days', 
//you will be given a JSON representation of that data. 
//You will be using the URL of this JSON to pull in the data for our visualization.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Query to retrieve the faultline data
var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
  
  // Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
});

  
function createFeatures(earthquakeData) {

   // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
  }

  function circleSize(magnitude) {
    return magnitude * 20000;
  }

// Create function to set the color for different magnitude
function markerColor(magnitude) {
  // Conditionals for magnitude
  if (magnitude >= 5) {
    return "red";
  }
  else if (magnitude >= 4) {
    return "orangered";
  }
  else if (magnitude >= 3) {
   return "orange";
  }
  else if (magnitude >= 2) {
    return "yellow";
  }
  else if (magnitude >= 1) {
    return "lime";
  }
  else {
    return "green";
  };

}

// Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: circleSize(earthquakeData.properties.mag),
        color: markerColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}



function createMap(earthquakes) {

    var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
      });
    
      var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });
    
      var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Greyscale Map": grayscalemap,
    "Outdoor Map": outdoorsmap,
    "Satellite Map": satellitemap
  };

  // Create the faultline layer
  var faultLine = new L.LayerGroup();

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    FaultLines: faultLine
    };

  // Create our map, giving it the satellite and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
        0.00, 0.00
    ],
    zoom: 5,
    layers: [grayscalemap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  function chooseColor(magnitude) {
    return magnitude > 5 ? "red":
      magnitude > 4 ? "orange":
        magnitude > 3 ? "gold":
          magnitude > 2 ? "yellow":
            magnitude > 1 ? "yellowgreen":
              "greenyellow"; // <= 1 default
  }

  // Adds Legend
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
     for (let i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

    return div;
  };
  legend.addTo(myMap);



}