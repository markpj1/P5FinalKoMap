
(function (window, google, mapster) {

		mapster.MAP_OPTIONS = {
			center: {
		lat: 38.2458,
		lng:-122.636
	},
	zoom:10,
	disableDefaultUI: false,
	scrollwheel: false,
	dragable: false,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	//maxZoom: 15,
	//minZoom: 10,
	zoomControlOptions: {
		position: google.maps.ControlPosition.LEFT_BOTTOM,
		style: google.maps.ZoomControlStyle.DEFAULT
	},
	panControlOptions: {
		position: google.maps.ControlPosition.TOP_LEFT
	}
		};


}(window, google, window.Mapster || (window.Mapster = {})));