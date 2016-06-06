var FourSquareClient = function (url) {
  //the base URL for the REST service
  var baseUrl = url;

  //method to retrieve products
  var getLocations = function (callback) {
    $.ajax({
      url: baseUrl,
      type: 'Get',
      success: function (result) {
         console.log('Foursquare Locations: ' +
          JSON.stringify(result));

          callback(result);
      }
    });
  };

  return {
    //add members that will be exposed publicly
    getLocations: getLocations
    //deleteLocations: deleteLocations
  };
};
