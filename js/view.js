var mapsApplication = function () {
    
	var map;
    

	//Sets local default
    this.currentLat = ko.observable(38.235);
    this.currentLng = ko.observable(-122.668);
	var localLocation  = {lat: this.currentLat() , lng: this.currentLng()};
       
	    var addressComponents = {
    	street_number: 'short_name', 
    	route: 'long_name',
    	locality: 'long_name',
    	administrative_area_level_1: 'long_name',
    	country: 'long_name',
    	postal_code: 'short_name'    	
    };

	//Constructor function for google map obj.
	var AddressModel = function () {
        var self = this;

        self.marker = ko.observable();
		self.location = ko.observable();
		self.streetNumber = ko.observable();
		self.streetName = ko.observable();
		self.city = ko.observable();
		self.state = ko.observable();
		self.postCode = ko.observable();
		self.country = ko.observable();
        self.food = ko.observable();	
	};


    //called in return statement
	var mapsModel = {
		fromAddress: ko.observable()
		
	};
    
	//Method to retrieve address information in the model.
	var populateAddress = function (place, value) {

		var address = new AddressModel();
		//set location

		address.location(place.geometry.location);
		//loop through the components and extract required
		//address fields
        for (var i = 0; i < place.address_components.length; i += 1) {   
       	
            var addressType = place.address_components[i].types[0];
        	if(addressComponents[addressType]) {
        		var val =
        		place.address_components[i][addressComponents[addressType]];
        		if(addressType == 'street_number') {
        			address.streetNumber(val);
        		}
        		else if (addressType == 'route') {
        			address.streetName(val);
        		}
        		else if (addressType == 'locality') {
        			address.city(val);
        		}
        		else if (addressType == 'administrative_area_level_1') {
        			address.state(val);
        		}
        		else if (addressType == 'country') {
        			address.country(val);
        		}
        		else if (addressType == 'postal_code') {
        			address.postCode(val);
        		}
        		else if (addressType == 'id_number') {
        			address.idNumber(val);
        		}
        	}
        }
        value(address);
	};


	//Method to retrieve and set local location.
	var setLocalLocation = function () {
		if('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(function (position) {
 				currentLat = position.coords.latitude;
 				currentLng = position.coords.longitude;
 				console.log('successfully retrieved local location. Lat [' + currentLat + '] lng [' + currentLng + ']');
			},
			function (error) {
				console.log('Could not get the coords: ' + error.message);
			});
		}
	};



		//Method to add custom binding handlers to knockout.
    var configureBindingHandlers = function () {
    	//Custom binding for address auto complete.
    	ko.bindingHandlers.addressAutoComplete = {
    		init: function (element, valueAccessor) {
    			//create the autocomplete object.
	            var autocomplete = new google.maps.places.Autocomplete(element,{ types: ['geocode'] });
    			
    			//when the user selects an address from the dropdown, populate 
    			//the address in the model.
    			var value = valueAccessor();
    			
    			google.maps.event.addListener(autocomplete, 'place_changed', function () {
    				var place = autocomplete.getPlace();
    				
    				updateAddress(place, value);
    			});
    		}
    	};
    	//custom binding handler for maps panel
    	ko.bindingHandlers.mapPanel = {
    		init: function (element, valueAccessor) {
          	map = new google.maps.Map(element, {
                zoom: 10,
                scrollwheel: false

          	});
          	centerMap(localLocation);          	
    	    }
        };
    };

    //Method to register subscriber
    var registerSubscribers = function () {
    	//fire before from address is changed
    	mapsModel.fromAddress.subscribe(function (oldValue) {
    		removeMarker(oldValue);
    	}, null, 'beforeChange');
    };

    //Method to update the address model
    var updateAddress = function (place, value) {
    	populateAddress(place, value);
    	placeMarker(place.geometry.location, value);
    };



    //Method to place a marker on the map
    var placeMarker = function (location, value) {
    	//create and place marker on the map
    	var marker = new google.maps.Marker({
    		position: location,
    		map: map
    	});
    	value().marker(marker);
    };

    //method to remove old marker from the map
    var removeMarker = function(address) {
    	if(address != null) {
    		address.marker().setMap(null);
    	}
    };

    //Method to center map based on the location.
    var centerMap = function (location) {
    	map.setCenter(location);
    	google.maps.event.trigger(map, 'resize');
    };


    var init = function () {
        

    	//initialize setLocalLocation
    	setLocalLocation();

    	//initialize registerSubscriber
    	registerSubscribers();
    	
        //initialize binding handlers.
    	configureBindingHandlers();

    	//initialize this module
    	ko.applyBindings(mapsApplication);
    };

    $(init);

    console.log('maps model: ',mapsModel);
    return {
    	mapsModel: mapsModel
    };









}();