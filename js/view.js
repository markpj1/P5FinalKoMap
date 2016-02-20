// Client id Foursquare:
// CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX
// Client secret:
// MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW
var mapsApplication = function() {
  var self = this;
  var map;
  

  //viewModel for knockout bindings to DOM
 self.placeHolder = {
    nameArr: nameArr = ko.observableArray([]), //.name
    address: address = ko.observableArray([]), //.location.address 
    contact: contact = ko.observableArray([]), //.contact.formattedPhone
    url: url = ko.observableArray([]), //.location.url
    lat: lat = ko.observableArray([]), //.location.formattedAddress.lat
    lng: lng = ko.observableArray([]) //.location.formattedAddress.lng             
  };


  console.log('placeHolder', self.placeHolder);
  //builds map for app 
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(38.235738, -122.641123),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    disableDefaultUI: true
  });


  //gets foursquare JSON OBJ with info
  var fourSquareAPI = 'https://api.foursquare.com/v2/venues/explore?client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX&client_secret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW&v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new';

$.getJSON(fourSquareAPI, function() {}).done(function(data) {
    var fourSquareObj = data.response.groups['0'].items;
    console.log('FSO', fourSquareObj);
    $.each(fourSquareObj, function(key, val) {
      var formattedVenue = val.venue;
      placeHolder.nameArr.push(formattedVenue.name);
      placeHolder.address.push(formattedVenue.location.formattedAddress);
      placeHolder.contact.push(formattedVenue.contact.formattedPhone);
      placeHolder.url.push(formattedVenue.url);
      placeHolder.lat.push(formattedVenue.location.lat);
      placeHolder.lng.push(formattedVenue.location.lng);

      //var bounceMarker = formattedVenue.location.lat + ' ' + formattedVenue.location.lng
      var contentString = '<div>' + formattedVenue.name + '</div>' + '<div>' + formattedVenue.location.formattedAddress + '</div>' + '<div>' + formattedVenue.contact.formattedPhone + '<div>' + '<div>' + '<a href=' + formattedVenue.url + '>' + formattedVenue.url + '</a>' + '</div>';
      var markerCoordinates = new google.maps.LatLng(formattedVenue.location.lat, formattedVenue.location.lng);


      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: markerCoordinates,
        map: map,
        icon: 'pics/restaurant.png'
      });

      //console.log('contentString', contentString);

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      //function toggleBounce() {
      google.maps.event.addListener(marker, 'click', function() {
        if (marker.getAnimation() != null) {
          marker.setAnimation(null);
        } else if (infowindow.open() != null) {
          infowindow.open(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          infowindow.open(map, marker);

        }
      });
    });
  }).fail(function () {
    alert('Failed to load, Please refresh')
  });



  var init = function() {

    //initMap();
    //initialize this module
    ko.applyBindings(mapsApplication);
  };


  $(init);


  return {
    placeHolder: placeHolder
  };




}();