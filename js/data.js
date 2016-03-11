var FourSquareClient = function (url) {
  //the base URL for the REST service
  var baseUrl = url;

  //method to retrieve products
  var getLocations = function (callback) {
    $.ajax({
      url: baseUrl,
      type: 'Get',
      success: function (result) {
         //console.log('Foursquare Locations: ' +
          //JSON.stringify(result));
         callback(result);
      }
    });
  };
  // //Method to delete product
  // var deleteLocations = function(product, callback) {
  //   console.log('Deleting product with ID ['  + product.data.id() + ']');
  //   $.ajax({
  //     url: baseUrl + product.data.id(),
  //     type: 'DELETE',
  //     success: function (result) {
  //       callback(product);
  //     }
  //   });
  // };

  return {
    //add members that will be exposed publicly
    getLocations: getLocations
    //deleteLocations: deleteLocations

  };

};