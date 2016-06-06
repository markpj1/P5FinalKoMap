
function Model () {
  var self = this;

//Hardcode array of obj
self.locations = [
    {
    "name": "Central Market Restaurant",
    "lat": 38.234017108732495,
    "lng": -122.64014482498169,
    "icon": "pics/restaurant.png" ,
    "venue_id":"4a8dfacff964a520a91120e3"
    },
    {
    "name": "Cucina Paradiso",
    "lat": 38.234490283333336,
    "lng": -122.6403,
    "icon": "pics/restaurant.png",
    "venue_id":"4b36be4ef964a520ae3b25e3"
    },
    {
    "name": "Aqus Cafe",
    "lat": 38.23130418393807,
    "lng": -122.63134140350398,
    "icon": "pics/restaurant.png",
    "venue_id":"4a8c8937f964a520680e20e3"
    },
    {
    "name": "Wild Goat Bistro" ,
    "lat": 38.233859,
    "lng": -122.638846,
    "icon": "pics/restaurant.png",
    "venue_id":"4b96b93bf964a5206ee034e3"
    },
    {
    "name":"Della Fattoria Café",
    "lat":38.23494390397751,
    "lng":-122.64086179955504,
    "icon": "pics/restaurant.png",
    "venue_id":"4a7cf2e1f964a52022ee1fe3"

    },
  ];
//Center google map
self.home = [38.234017108732495, -122.64014482498169];

//mapMarker holder array
self.markers = [];
self.infoWindows = [];

}//End Model

//creates ne instance of Model
var model = new Model();

function ViewModel () {
  var self = this;

  //holds fourSquare API Tokens
  var CLIENT_ID = "CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX";
  var CLIENT_SECRET = "MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW";

  //set varaiable to track which map marker is currently selected.
  var markerBouncing = null;

  //set varaiable to track which infoWindow is currently open.
  var openInfoWindow = null;

  //Declare array for storing mapMarker content string from fourSquare
  var HTMLcontentString = "";
  self.contentStrings = [];

  //Define observable for the search term.
  self.searchTerm = ko.observable("");

  //If Api fails to load show Error msg
  self.showErrorMessage = ko.observable("hidden");

 //creates searchList array, and self.results observableArray = initResultsList
  self.initResults = function (locations) {
    self.initResultsList = [];
    self.searchList = [];
    for (var i = 0; i < locations.length; i++) {
      var item = locations[i].name;
      self.initResultsList.push(item);
      //LowerCase for search
      self.searchList.push(item.toLowerCase());
    }
    //observableArray to populate locations List View .
    self.results = ko.observableArray(self.initResultsList.slice(0));
    console.log('InitResults', self.initResultsList);
  };

  //Initialize the list with hard-coded locations.
  self.initResults(model.locations);

  //Check search query against all locations and filters list.
  self.updateListAndMap = function () {
    //Empties the results and adds the result that matches query.
    self.results.removeAll();
    //Loop throughMarkers, hides locations filtered out and sets the matched location marker to visible.
    for (var i = 0; i < model.markers.length; i++) {
      model.markers[i].setVisible(false);
    }
    self.searchList.forEach(function (item, index) {
      if(item.indexOf(self.searchTerm().toLowerCase()) > -1) {
        self.results.push(self.initResultsList[index]);
        model.markers[index].setVisible(true);
      }
    });
    //If the input is empty, resets all locations to be visible.
      if(self.searchTerm() === "") {
        self.results(self.initResultsList.slice(0));
        model.markers.forEach(function (item) {
          if(!item.getVisible()) {
            item.setVisible(true);
          }
        });
      }

  }.bind(this);

  //Define and use googleMaps Object.
  self.clearSearch = function () {
    self.searchTerm('');
    if(openInfoWindow) openInfoWindow.close();
    if(markerBouncing) markerBouncing.setAnimation(null);
    self.updateListAndMap();
    self.map.panTo(self.homeLatLng);
    self.map.setZoom(15);
  };

  //Function takes all parameters for google map object
  function showMap (latLng) {
    var googleLatAndLong = latLng;
    var bounds = new google.maps.LatLngBounds();
    var LatLngBounds = bounds.extend(googleLatAndLong);

    var mapOptions = {
      zoom: 15,
      center: googleLatAndLong,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true

    };

    var mapDiv = document.getElementById("mapDiv");
    var map = new google.maps.Map(mapDiv, mapOptions);

    map.fitBounds(LatLngBounds);

    var listener = google.maps.event.addListener(map, "idle", function () {
      if(map.getZoom() > 15) {
         map.setZoom(15);
         google.maps.event.removeListener(listener);
      }
    });
    return map;
  }
//set the default latLng setting
self.homeLatLng = new google.maps.LatLng(model.home[0], model.home[1]);

//initialize the map using the home location google maps lat lng object.
self.map = showMap(self.homeLatLng);

//Create mapMarkers function
function addMarker(map, latLng, title, content, icon) {
  var markerOptions = {
    position: latLng,
    map: map,
    title: title,
    animation: google.maps.Animation.DROP,
    icon: icon
  };

  var marker = new google.maps.Marker(markerOptions);
  marker.addListener('click', toggleBounce);

  var infoWindowOptions = {
    content: content,
    position: latLng
  };

  var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
  model.infoWindows.push(infoWindow);

  google.maps.event.addListener(marker, "click", function () {
    if(openInfoWindow)
      openInfoWindow.close();
      openInfoWindow = infoWindow;
      infoWindow.open(map, marker);

  });

  google.maps.event.addListener(infoWindow, "closeClick", toggleBounce);

  function toggleBounce () {
    if(markerBouncing) {
      markerBouncing.setAnimation(null);
    }
    if(markerBouncing != marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      markerBouncing = marker;
    }
    else
    {
      markerBouncing = null;
    }
  }
  return marker;
}

//Find the marker that is currently selected in the list of marker.
self.selectMarkerFromList = function (currentlySelected) {
  for (var i = 0; i < model.markers.length; i++) {
    if(currentlySelected == model.markers[i].title) {
      toggleInfoWindow(i);
    }
  }
}.bind(this);

//Function to toggle the infowindow of a specific marker
function toggleInfoWindow (id) {
  google.maps.event.trigger(model.markers[id], "click");
}

//Create other functions to communicate with Model, Observable, and APIs
self.initMap = function (data) {
  for (var i = 0; i < data.length; i++) {
    var location = data[i];
    var googleLatAndLong = new google.maps.LatLng(location.lat, location.lng);
    var windowContent = location.name;
    //Create and add markers to map
    var marker = addMarker(self.map, googleLatAndLong, location.name, windowContent, location.icon);
    //Add marker to data model.
    model.markers.push(marker);
  }
};

//Set timer to show error msg if FourSquare JSON fails
self.timer = setTimeout(function () {
  self.showErrorMessage("");
},8000);

//Make API request from fourSquare
self.getLocationData = function(locations) {
      //var url = "https://api.foursquare.com/v2/venues/explore?client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX&client_secret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW&v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new"
    for (var i = 0; i < locations.length; i++) {
      //console.log('Locations[i]',locations[i]);
      var url = "https://api.foursquare.com/v2/venues/"+
            locations[i].venue_id+
            "?client_id="+
            CLIENT_ID+
            "&client_secret="+
            CLIENT_SECRET+
            "&v=20150909&callback=ViewModel.callback";
      var newScriptElement = document.createElement("script");
      newScriptElement.setAttribute("src", url);
      newScriptElement.setAttribute("id", "jsonp");
      //Set onload attribute to check if resource loads. If onload fires, clear the timer
      newScriptElement.setAttribute("onload", "clearTimeout(ViewModel.timer)");
      var oldScriptElement = document.getElementById("jsonp");
      var head = document.getElementsByTagName("head")[0];
      if (oldScriptElement === null) {
        head.appendChild(newScriptElement);
      } else {
        head.replaceChild(newScriptElement, oldScriptElement);
      }
    }
  };

//Takes in the JSON response from the fourSquare API, constructs an HTML string, and sets it to the content of the relevent infoWiondow
self.callback = function (data) {
  console.log('model.infoWindows',model.infoWindows);
  model.infoWindows.forEach(function (item, index, array) {
    if(item.content == data.response.venue.name) {
        HTMLcontentString = "<p><strong><a class='place-name' href='"+
                    data.response.venue.canonicalUrl+"'>"+
                    data.response.venue.name+
                    "</a></strong></p>"+
                    "<p>"+data.response.venue.location.address+
                    "</p><p><span class='place-rating'><strong>"+
                    data.response.venue.rating+
                    "</strong><sup> / 10</sup></span>"+
                    "<span class='place-category'>"+
                    data.response.venue.categories[0].name+
                    "</p><p>"+data.response.venue.hereNow.count+
                    " people checked-in now</p>"+
                    "<img src='"+data.response.venue.photos.groups[0].items[0].prefix+
                    "80x80"+
                    data.response.venue.photos.groups[0].items[0].suffix+
                    "'</img>";
          item.setContent(HTMLcontentString);
    }
  });
};
//Make request to get FourSquare data
  console.log('model locations???', model.locations);
  self.getLocationData(model.locations);

  //Initialize the map with a list of locations hardcoded in data model and foursquare data for marker window content
  self.initMap(model.locations);


}


















 var ViewModel = new ViewModel();



var init = function () {

  ko.applyBindings(ViewModel);
};

$(init); //jQuery..
