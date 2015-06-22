$(document).ready(function() {
  var marketId = []; //returned from the API
  var allLatlng = []; //returned from the API
  var allMarkers = []; //returned from the API
  var marketName = []; //returned from the API
  var infowindow = null;
  var pos;
  var userCords;
  var tempMarkerHolder = [];
  var allMarkersArray = [];

  // get two input val
  $('#button1').on('click', function(){
    console.log('click button');
    var input1 = $('#text1').val();
    console.log(input1);
  });

  // get user current location
  if (navigator.geolocation) {    

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    function success(pos){
      userCords = pos.coords;

      //return userCords;
    }

    // Get the user's current position
    navigator.geolocation.getCurrentPosition(success, error);
    //console.log(pos.latitude + " " + pos.longitude);
  } else {
    alert('Geolocation is not supported in your browser');
  }
  //End Geo location

  //map options
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(37.09024, -100.712891),
    panControl: false,
    panControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    scaleControl: false

  };  

  //Adding infowindow option
  infowindow = new google.maps.InfoWindow({
    content: "holding..."
  }); 

  //Fire up Google maps and place inside the map-canvas div
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  google.maps.Map.prototype.clearOverlays = function() {
    for (var i = 0; i < allLatlng.length; i++ ) {
      allLatlng[i].setMap(null);
    }
    allLatlng = [];
    return false;
  };

  $('#chooseZip').submit( function() {
    if (allLatlng.length != 0) {
      console.log('previous markers exist');
      console.log(allLatlng.length);
      console.log(marketId.length);
      console.log(marketName.length);
      map.clearOverlays();
      console.log(allLatlng.length);
      marketId = [];
      marketName = [];
    };

    var userZip = $('#textZip').val();
    
    var access_url;

    if(userZip){
			accessURL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + userZip;
		} else {
			accessURL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + userCords.latitude + "&lng=" + userCords.longitude;
		}
  
    //console.log(userCords);

    var counter = 0;
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: accessURL,
      dataType: 'jsonp',
      success: function (data) {
        $.each(data.results, function (i, val){
          marketId.push(val.id);
          marketName.push(val.marketname);
        }); //end for each

        //console.log(marketName);
        var counter = 0;
        $.each(marketId, function (k, v){
          $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            // submit a get request to the restful service mktDetail.
            url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + v,
            dataType: 'jsonp',
            success: function(data){
              
              //console.log(data);
              for (var key in data) {
                //console.log(key);
                var results = data[key];

                var googleLink = results['GoogleLink'];
								var latLong = decodeURIComponent(googleLink.substring(googleLink.indexOf("=")+1, googleLink.lastIndexOf("(")));
								
								var split = latLong.split(',');
								var latitude = split[0];
								var longitude = split[1];

                //console.log(latitude, longitude);

                //set the markers.	  
								myLatlng = new google.maps.LatLng(latitude,longitude);
						  
								allMarkers = new google.maps.Marker({
									position: myLatlng,
									map: map,
									title: marketName[counter],
									html: 
											'<div class="markerPop">' +
											'<h1>' + marketName[counter].substring(4) + '</h1>' + //substring removes distance from title
											'<h3>' + results['Address'] + '</h3>' +
											'<p>' + results['Products'].split(';') + '</p>' +
											'<p>' + results['Schedule'] + '</p>' +
											'</div>'
								});

								//put all lat long in array
								allLatlng.push(myLatlng);

                counter++;


              }; // end for of data


              //allMarkersArray.push(allMarkers);
              google.maps.event.addListener(allMarkers, 'click', function () {
									infowindow.setContent(this.html);
									infowindow.open(map, this);
              });

              var bounds = new google.maps.LatLngBounds ();
								//  Go through each...
								for (var i = 0, LtLgLen = allLatlng.length; i < LtLgLen; i++) {
								  //  And increase the bounds to take this point
								  bounds.extend (allLatlng[i]);
								}
								//  Fit these bounds to the map
								map.fitBounds (bounds);

            }

          });
        }); // end for each marketID
        

      }
    
    }); //end top ajax

    return false;


  });

});
