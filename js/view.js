// Client id Foursquare:
// CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX
// Client secret:
// MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW



var MapsApplication = (function() {

  var self = this;
  var map;
  var localLocation = {lat:38.235738, lng:-122.641123};
  var fourSquareAPI = FourSquareClient('https://api.foursquare.com/v2/venues/explore?client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX&client_secret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW&v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new');


  self.locationModel = function (item) {
    var self = this;
    self.data = {};
    self.data.location = item.location; //.location.address
    self.data.formattedAddress = item.location.formattedAddress;
    self.data.lat = item.location.lat; //.location.formattedAddress.lat
    self.data.lng = item.location.lng; //.location.formattedAddress.lng
    self.data.contact = item.contact; //.location.formattedAddress.lng
    self.data.formattedPhone = item.contact.formattedPhone; //.contact.formattedPhone
    self.data.name = item.name; //.name
    self.data.url = item.url; //.location.url
    self.data.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.data.lat, self.data.lng),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'pics/restaurant.png',
        content: 'This thing'
    });
    self.data.openInfoWindow =  function() {
      //self.data.marker.infoWindow.setContent(marker.content);
        //this.marker.
       console.log('binding working?????');
       self.data.infowindow.open(map, placeMarker);//?????

    };

    //self.data.marker = null;

  };

  self.locations = ko.observableArray();

  self.query = ko.observable('');

  self.filteredLocations = ko.computed(function () {
      var filter = self.query().toLowerCase();
      return ko.utils.arrayFilter(self.locations(), function (item) {
        var match = item.name.toLowerCase().indexOf(filter) !== -1;
        item.marker.setVisible(match);
        return match;
      });
  });

  //Methods to retrieve locations info from foursquare
  var retrieveLocations = function () {
    console.log('retrieving locations from server: ');
    fourSquareAPI.getLocations(retrieveLocationsCallback);
  };

  var retrieveLocationsCallback = function (data) {
      fourSquareObj = data.response.groups['0'].items;
      var dataFromServer = ko.utils.parseJson(fourSquareObj);
       dataFromServer = $.map(fourSquareObj,function (value, key) {
        return new locationModel(value.venue);
      });
      dataFromServer.forEach(function (value) {
      self.locations.push(value.data);
      });
      placeMarker();
      console.log(locations());
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
   };

  //  self.data.marker = new google.maps.Marker({
  //       position: new google.maps.LatLng(self.data.lat, self.data.lng),
  //       map: map,
  //       animation: google.maps.Animation.DROP,
  //       icon: 'pics/restaurant.png',
  //       content: 'This thing'
  //   });


  var placeMarker = function () {
        locations().forEach(function(value, key) {


        self.google.maps.event.addListener(value.marker, 'click', function() {
            //console.log(value.marker)
            if (value.marker.getAnimation() !== null) {
              value.marker.setAnimation(null);
              infowindow.open(null);
            }
             else if (infowindow.open() !== null) {
              value.marker.setAnimation(null);
              infowindow.open(null);
            }
             else
            {
              value.marker.setAnimation(google.maps.Animation.BOUNCE);
              infowindow.open(map, value.marker);
            }
            // setTimeout(function() {
            //         value.marker.setAnimation(null);
            //     }, 10000);
      });


      var contentString = '<div>' + value.name + '</div>' + '<div>' + value.formattedAddress + '</div>' + '<div>' + value.formattedPhone + '<div>' + '<div>' + '<a href=' + value.url + '>' + value.url + '</a>' + '</div>';
      var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

    });

  };



  var init = function() {
    //code that initializes this module
    configureBindingHandlers();
    retrieveLocations();
    ko.applyBindings(MapsApplication);
  };


  $(init); //Document Load ready JQuery function



  return {
    //members that are exposed publicly
    query: query,
    locationModel: locationModel
  };

}());
