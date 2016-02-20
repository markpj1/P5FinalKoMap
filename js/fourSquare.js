//  $.getJSON({
//   url: "https://api.foursquare.com/v2/venues/explore?v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new",
//   context: document.body
// }).done(function(data) {
    
//       console.log( "Sample of data:", data );

//   //$( this ).addClass( "done" );
//   //console.log(this);
// });


// (function(){
// // name
// // contact['formattedPhone']
// // url
// // location['formattedAddress']['lat']
// // location['formattedAddress']['lng']
// //location.formattedAddress


// //var client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX
// //var clientSecret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW

// 	$.getJSON( 'https://api.foursquare.com/v2/venues/explore?client_id=CYQXZPHH1KFEC0AQFBB3NLNSOE2KOQWJ40AU3BIG0YWLI2ZX&client_secret=MJV2WN3QLPZAHPMQ4GT5U212AVUPPZVDEKN3DCEOHFE4AMXW&v=20131016&ll=38.23%2C%20-122.64&section=food&limit=5&novelty=new', function( data ) {
// 	  var items = [];
// 	    var fourSquareObj = data['response']['groups']['0']['items'];
//         fourSquareObj.forEach(function (val) {
//         	console.log('val inside foreach',val);
//         }) 

//          //items.push(fourSquareObj);
// 	    //console.log(fourSquareObj);
// 	});
// }());