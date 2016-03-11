// Client id Foursquare:
// CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX
// Client secret:
// MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW
var MapsApplication = (function() {
  
  var self = this;
  var map;
  var localLocation = {lat:38.235738, lng:-122.641123};
  var fourSquareAPI = FourSquareClient('https://api.foursquare.com/v2/venues/explore?client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX&client_secret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW&v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new');
  var locations;
  var fourSquareObj
  //viewModel for knockout bindings to DOM
 var locationModel = function (item) {
    this.data = {};
    this.data.location = ko.observable(item.location); //.location.address 
    this.data.location.formattedAddress = ko.observable(item.location.formattedAddress);
    this.data.location.lat = ko.observable(item.location.lat); //.location.formattedAddress.lat
    this.data.location.lng = ko.observable(item.location.lng); //.location.formattedAddress.lng   
    this.data.contact = ko.observable(item.contact); //.location.formattedAddress.lng    
    this.data.contact.formattedPhone = ko.observable(item.contact.formattedPhone); //.contact.formattedPhone
    this.data.name = ko.observable(item.name); //.name
    this.data.url = ko.observable(item.url); //.location.url
  };

  locations = ko.observableArray(); 
  
  
  var placeMarker = function () {
    //console.log('LookFirst',locations())
        locations().forEach(function(value, keys) {
          var markerCoordinates = new google.maps.LatLng(value.data.location().lat , value.data.location().lng);
                                      
          var marker = new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              position: markerCoordinates,
              map: map,
              icon: 'pics/restaurant.png'
            });
        });    
  };
  
  //Methods to retrieve locations info using foursquare 
  var retrieveLocations = function () {
    console.log('retrieving locations from server: ');
    fourSquareAPI.getLocations(retrieveLocationsCallback);
  };

  var retrieveLocationsCallback = function (data) {
      fourSquareObj = data.response.groups['0'].items;
      fourSquareObj.forEach(function (value,key) {
        locations.push(new locationModel(value.venue));
      });
      placeMarker();
      searchLocations(locations());        
  };

  var searchLocations = function (object) {    
    object.forEach(function (value, key) {
      var newArray = value.data.name().pop(object);
      console.log('newnewnew',newArray);
    });

   
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
       //var bounceMarker = placeHolder.lat() + ' ' + placeHolder.lng();
            // markerCoordinates = new google.maps.LatLng({lat:locations().data.location.lat(), lng:locations().data.location.lng()}); //this is where I think I need to use knockout observables?        
            // console.log('marker coords', markerCoordinates);
          // var infowindow = new google.maps.InfoWindow({
          //   content: contentString
          // });  
          
   };
       // var placeMarker = function (location, value) {
       //      var marker = new google.maps.Marker({
       //        animation: google.maps.Animation.DROP,
       //        position: localLocation,
       //        map: map,
       //        icon: 'pics/restaurant.png'
       //      });
            
       // }

       
      
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


  var init = function() {
    //code that initializes this module
    
    configureBindingHandlers();
    retrieveLocations(); 
    ko.applyBindings(MapsApplication);
  };


  $(init);


    console.log('locations objjjjj', locations().length);
  return {
    //members that are exposed publicly
    locations: locations
  };




}());