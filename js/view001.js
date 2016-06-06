function Model() {
    var self = this; //jscs:ignore

    self.locations = [{
        'name': 'Central Market Restaurant',
        'lat': 38.234017108732495,
        'lng': -122.64014482498169,
        'icon': 'pics/restaurant.png',
        'venue_id': '4a8dfacff964a520a91120e3'
    }, {
        'name': 'Cucina Paradiso',
        'lat': 38.234490283333336,
        'lng': -122.6403,
        'icon': 'pics/restaurant.png',
        'venue_id': '4b36be4ef964a520ae3b25e3'
    }, {
        'name': 'Aqus Cafe',
        'lat': 38.23130418393807,
        'lng': -122.63134140350398,
        'icon': 'pics/restaurant.png',
        'venue_id': '4a8c8937f964a520680e20e3'
    }, {
        'name': 'Wild Goat Bistro',
        'lat': 38.233859,
        'lng': -122.638846,
        'icon': 'pics/restaurant.png',
        'venue_id': '4b96b93bf964a5206ee034e3'
    }, {
        'name': 'Della Fattoria Café',
        'lat': 38.23494390397751,
        'lng': -122.64086179955504,
        'icon': 'pics/restaurant.png',
        'venue_id': '4a7cf2e1f964a52022ee1fe3'
    }];

    //CenterMap/Reset location.
    self.home = {
        lat: 38.234017108732495,
        lng: -122.64014482498169
    };

    //mapMarker and InfowWindow dataHolder
    self.markers = [];
    self.infowWindow = [];
}

//new instance of Model.
var model = new Model();

//see initial instance.
//console.log(model);

function ViewModel() {
    var self = this;


    //holds fourSquare API Tokens
    var CLIENT_ID = 'CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX';
    var CLIENT_SECRET = 'MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW';

    //set varaiable to track which mapMarker is currently selected.
    var markerBouncing = null;

    //set variable to track if infowWindow is currently open.
    var openInfoWindow = null;

    //Declare array for storing mapMarker & content sting from fourSquare
    var HTMLcontentString = '';
    self.contentStrings = [];

    //Define Observables here

    //Observable for searchTerm
    self.searchTerm = ko.observable('');

    //If API fails to load show Error msg
    self.showErrorMessage = ko.observable('hidden');

    //creates results observable fron Model.locations.
    self.initResults = function(locations) {
        self.initResultsList = [];
        self.searchList = [];
        _.each(locations, function(item) {
            var items = item.name;
            self.initResultsList.push(items);
            //LowerCase for search
            self.searchList.push(items.toLowerCase());
        });
        self.results = ko.observable(self.initResultsList.slice(0));
    };
    //Initialize the list with model.locations object.
    self.initResults(model.locations);

    //Search function query all locations and filters list
    self.updateListAndMap = function () {
        //Empty results and add results that match query
        self.results.removeAll();
        for (var i = 0; i < markers.length; i++) {
          model.markers[i].setVisisble(false);
        }
        _.each(self.searchList, function (item, index) {
          if(item.indexOf(self.searchTerm().toLowerCase()) > -1) {
            self.results.push(self.initResultsList[index]);
            model.markers[index].setVisible(true);
          }
        });
        //If the input is empty, resets all locations to be visible.
        if(self.searchTerm() === '') {
          self.results(self.initResultsList.slice(0));
          _each(model.markers, function (item) {
            if(!item.getVisible()) {
              item.setVisible(true);
            }
          });
        }

    }.bind(this);

    //function takes parameters for google map objects.
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

      var mapDiv = $('#mapDiv');
      var map = new google.maps.Map(mapDiv, mapOptions);

      map.fitBounds(LatLngBounds);

      var listener = google.maps.event.addListener(map, 'idle', function () {
        if(map.getZoom() > 15) {
          map.setZoom(15);
          google.maps.event.removeListener(listener);
        }
      });
      return map;
    }//showMap

    //set the default latLng setting;
    self.homeLatLng = new google.maps.LatLng(model.home.lat, model.home.lat);

    //initialize the map using the homeLatLng.
    self.map = showMap(self.homeLatLng);

    function addMarker (map, latLng, title, content, icon) {
      var markerOptions = {
        position: latLng,
        map: map,
        title: title,
        animation: googglemaps.Animation.DROP,
        icon: icon
      };


      var marker = new google.maps.Marker(markerOptions);
      marker.addListener('click', toggleBounce);

      var infoWindowwOptions ={
        content: content,
        position: latLng
      };

      var infoWindow = new google.maps.infoWindow(infoWindowwOptions);
      model.infoWindows.push(infoWindow);
      google.map.event.addListener(marker, 'click', function () {
        if(openInfoWindow)
        openInfoWindow.close();
        openInfoWindow = infowindow;
        infowindow.open(map, marker);

      });

google.maps.event.addListener(marker, 'closeClick', toggleBounce);

function toggleBounce () {
  if(markerBouncing) {
    markerBouncing.setAnimation(null);
  }
  if(markerBouncing !== marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    markerBouncing = marker;
  }
  else {
    markerBouncing = null;
  }
}
return marker;
}

//Find Marker that is currentlyselected in the list of markers.
  self.selectMarkerFromList = function (currentlySelected) {
      _.each(model.markers, function (item, index) {
        if(currentlySelected === item.title) {
          toggleInfoWindow(index);
        }
      });
  }.bind(this);

  function toggleInfoWindow (id) {
    google.maps.event.trigger(model.markers[id], 'click');
  }

  //Create other functions to communicate with Model, Observable and APIs
  self.initMap = function (data) {
    for (var i = 0; i < data.length; i++) {
      var location = data[i];
      var googleLatAndLong = new google.maps.LatLng(location.lat, location.lng);
      var windowContent = location.name;
      //Create and add markers to maps
      var marker = addMarker(self.map, googleLatAndLong, location.name, windowContent);
      //Add marker to data model.
      model.markers.push(marker);
    }
  };

  self.timer = setTimeout(function () {
    self.showErrorMessage('');
    alert('Hello');
  },8000);

  var getLocations = function (callback) {
    $.ajax({
      url: "https://api.foursquare.com/v2/venues/explore?client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX&client_secret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW&v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new",
      type: 'Get',
      success: function (result) {
         console.log('Foursquare Locations: ' +
          JSON.stringify(result));

          callback(result);
      }
    });
  }();










} //EndviewModel

var ViewModel = new ViewModel();



var init = function() {

    ko.applyBindings(ViewModel);
};

$(init); //jQuery..
