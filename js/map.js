$(document).ready(function() {
  var marketId = []; //returned from the API
  var allLatlng = []; //returned from the API
  var allMarkers = []; //returned from the API
  var marketName = []; //returned from the API
  var infowindow = null;
  var pos;
  var userCords;
  var tempMarkerHolder = [];

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

  $('#chooseZip').submit( function() {
    var user_zip = $('#textZip').val();
    
    var access_url;

    if(userZip){
			accessURL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + userZip;
		} else {
			accessURL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + userCords.latitude + "&lng=" + userCords.longitude;
		}
  
    console.log(user_zip);


    return false;


  });

});
