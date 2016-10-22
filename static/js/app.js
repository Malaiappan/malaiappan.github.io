 var searches = [];
 
 if ('serviceWorker' in navigator) {
    navigator.serviceWorker
         .register('service-worker.js', {scope: './'})
       .then(function() { console.log('Service Worker Registered'); });
  }
  
document.getElementById("button").addEventListener('click', function() {
    // Open/show the add new city dialog
    getData();
  });
  
  
document.getElementById("mySearch").addEventListener('click', function() {
    // Open/show the add new city dialog
    showMySearches();
  });
  
  showMySearches = function() {
	  var searchedRoutes = JSON.parse(localStorage.searchedRoutes)
	  console.log(searchedRoutes)
	  var html = "";
	  for(var i = 0, l = searchedRoutes.length; i < l; i++) {
		  console.log(searchedRoutes[i].from)
    		html = html + "<a href=\"" + searchedRoutes[i].url + "\">" + searchedRoutes[i].from + "-" + searchedRoutes[i].to + "</a>";
			//html = html + "<a href=\"http://localhost:3001/\">asdf</a>"
	  }
	  document.getElementById("searchList").innerHTML = html
  }
  
  saveSearches = function() {
    var searchedRoutes = JSON.stringify(searches);
    localStorage.searchedRoutes = searchedRoutes;
  };
  
getData = function() {
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
    var url = 'http://localhost:3001/findForRoute?from=' + from + '&to=' + to;
	
	searches.push({"from":from, "to":to, "url":url})
	saveSearches();
	
    // TODO add cache logic here
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
			  console.log("from cache" + json)
			 console.log("cache size" + json.flights.length)
			 var html = "";
			 for(var i = 0, l = json.flights.length; i < l; i++) {
				html = html + "<p>" + json.flights[i].flightNumber + "</p>";
			 }
			 document.getElementById("flightNumber").innerHTML = html
			 console.log("filled from cache")
			  return;
          });
        }
      });
    }
    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
		  console.log("from request" + response)
		  
		   console.log("size from network" + response.flights.length)
			 var html = "";
			 for(var i = 0, l = response.flights.length; i < l; i++) {
				html = html + "<p>" + response.flights[i].flightNumber + "</p>";
			 }
			 document.getElementById("flightNumber").innerHTML = html
			 console.log("filled from network")
        }
      } else {
		  console.log("error for " + url)
        // Return the initial weather forecast since no data is available.
       // app.updateForecastCard(initialWeatherForecast);
      }
    };
    request.open('GET', url);
    request.send();
  };

 