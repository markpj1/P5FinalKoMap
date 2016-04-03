

self.mapModel = [
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

  var viewModel = {

  mapModel: ko.observableArray(mapModel),  

  locations: ko.observableArray(),
    
  query: ko.observable(''),
  
  
    // remove all the current locations, which removes them from the view
    search: function(value) {
        viewModel.mapModel.removeAll();
        for(var x in mapModel) {
          if(mapModel[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            viewModel.mapModel.push(mapModel[x]);
          }
        }
      }  
};
viewModel.query.subscribe(viewModel.search)