// Client id Foursquare:
// CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX
// Client secret:
// MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW



var MapsApplication = (function() {
  
 var locationModel = function (item) {
    var self = this;
    self.data = {};
    self.data.location = ko.observable(item.location); //.location.address 
    self.data.formattedAddress = ko.observable(item.location.formattedAddress);
    self.data.lat = ko.observable(item.location.lat); //.location.formattedAddress.lat
    self.data.lng = ko.observable(item.location.lng); //.location.formattedAddress.lng   
    self.data.contact = ko.observable(item.contact); //.location.formattedAddress.lng    
    self.data.formattedPhone = ko.observable(item.contact.formattedPhone); //.contact.formattedPhone
    self.data.name = ko.observable(item.name); //.name
    self.data.url = ko.observable(item.url); //.location.url
  };
  
  var self = this;
  var map;
  var localLocation = {lat:38.235738, lng:-122.641123};
  var fourSquareAPI = FourSquareClient('https://api.foursquare.com/v2/venues/explore?client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX&client_secret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW&v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new');  
  var fourSquareObj;
  var locationSearch;
  //viewModel for knockout bindings to DOM
  var mapModel = [
    {
    "name": "Central Market Restaurant",    
    "lat": 38.234017108732495,
    "lng": -122.64014482498169    
    },  
    {
    "name": "Cucina Paradiso",    
    "lat": 38.234490283333336,
    "lng": -122.6403   
    },  
    {
    "name": "Aqus Cafe",  
    "lat": 38.23130418393807,
    "lng": -122.63134140350398   
    },  
    {
    "name": "Wild Goat Bistro" , 
    "lat": 38.233859,
    "lng": -122.638846   
    },  
    {
    "name": "Cafe Zazzle" , 
    "lat": 38.23433575,
    "lng": -122.64162   
    },  
  ];  

  self.mapModel = ko.observableArray(mapModel);  

  self.locations = ko.observableArray();
    
  self.query = ko.observable('');  
    
  self.filteredLocations = ko.computed(function () {    
    var filter = self.query().toLowerCase();
    if (!filter) {
      return self.locations();
    }
    else {
      return ko.utils.arrayFilter(self.locations(), function (item) {
        //console.log(item.name())
        return item.name().toLowerCase().indexOf(filter) !== -1;
      });
    }
  })
  
  //Methods to retrieve locations info using foursquare 
  self.retrieveLocations = function () {
    console.log('retrieving locations from server: ');
    fourSquareAPI.getLocations(retrieveLocationsCallback);
  };

  self.retrieveLocationsCallback = function (data) {
      fourSquareObj = data.response.groups['0'].items;
      var dataFromServer = ko.utils.parseJson(fourSquareObj);
       dataFromServer = $.map(fourSquareObj,function (value, key) {
        return new locationModel(value.venue);
      });
      dataFromServer.forEach(function (value) {
      self.locations.push(value.data);            
        
      });
      //viewModel.search;
      console.log('???????????????????????',dataFromServer)   
      console.log('why again think', self.locations());
      placeMarker();
  };
      
  var configureBindingHandlers = function () {    
      //builds map for app
      ko.bindingHandlers.mapPanel = {          
        init: function (element, valueAccessor) {
          map = new google.maps.Map(element, {
          zoom: 15,
          center: localLocation,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scrollwheel: false,
          disableDefaultUI: true
          });

        }
      };        
       // var bounceMarker = placeHolder.lat() + ' ' + placeHolder.lng();
       //      markerCoordinates = new google.maps.LatLng({lat:locations().data.location.lat(), lng:locations().data.location.lng()}); //this is where I think I need to use knockout observables?        
       //      console.log('marker coords', markerCoordinates);
       //    var infowindow = new google.maps.InfoWindow({
       //      content: contentString
       //    });  
         
   };
       // var placeMarker = function (location, value) {
       //      var marker = new google.maps.Marker({
       //        animation: google.maps.Animation.DROP,
       //        position: localLocation,
       //        map: map,
       //        icon: 'pics/restaurant.png'
       //      });
            
       //}

  self.placeMarker = function () {
    console.log('LookFirst',locations())
        locations().forEach(function(value, key) {
          console.log('placeMarker locations obj', value.lat()); 
          var markerCoordinates = new google.maps.LatLng(value.lat(), value.lng());
                                      
          var marker = new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              position: markerCoordinates,
              map: map,
              icon: 'pics/restaurant.png'
            });
        });    
  };
       
      
      //var contentString = '<div>' + placeHolder.nameArr()[key] + '</div>' + '<div>' + placeHolder.address()[key] + '</div>' + '<div>' + placeHolder.contact()[key] + '<div>' + '<div>' + '<a href=' + placeHolder.url()[key] + '>' + placeHolder.url()[key] + '</a>' + '</div>';
   //    google.maps.event.addListener(marker, 'click', function() {
   //      if (marker.getAnimation() != null) {
   //        marker.setAnimation(null);
   //        infowindow.open(null);
   //      } else if (infowindow.open() != null) {
   //        marker.setAnimation(null);
   //        infowindow.open(null);
   //      } else {
   //        marker.setAnimation(google.maps.Animation.BOUNCE);
   //        infowindow.open(map, marker);
   //      }
   //    });


   //self.query.subscribe(self.search);
  var init = function() {
    //code that initializes this module
    //placeMarker();

    configureBindingHandlers();
    retrieveLocations(); 
    ko.applyBindings(MapsApplication);
    
    
  };


  $(init);


    //console.log('locations objjjjj', locations().length);
  return {
    //members that are exposed publicly
    //searchLocation: searchLocation,
    //removeLocation: removeLocation,\
    //mapped, mapped,
    //search: search,
    //placeMarker: placeMarker,
    
    mapModel: mapModel,
    query: query,
    locationModel: locationModel,
    
  };




}())