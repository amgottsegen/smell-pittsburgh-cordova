var Location = {

  hasLocation: false,
  isRequestingLocation: false,
  coords: {},

  watchIds: [],


  requestLocationPermission: function() {
    console.log("requestLocationPermission");
    var requestAuth = function(status) {
      switch(status) {
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          console.log("Permission granted");
          App.authorizationStatus = Constants.AuthorizationEnum.GRANTED;
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
          console.log("Permission denied");
          App.authorizationStatus = Constants.AuthorizationEnum.DENIED;
          break;
      }
    };
    var requestAuthError = function() {
      console.log("error in requesting location authorization");
    };
    var authorizationStatus = function(status){
      switch(status){
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          console.log("Permission not requested");
          cordova.plugins.diagnostic.requestLocationAuthorization(requestAuth, requestAuthError);
          break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          console.log("Permission granted");
          App.authorizationStatus = Constants.AuthorizationEnum.GRANTED;
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
          console.log("Permission denied");
          cordova.plugins.diagnostic.requestLocationAuthorization(requestAuth, requestAuthError);
          break;
      }
    };

    cordova.plugins.diagnostic.getLocationAuthorizationStatus(authorizationStatus, function(error){console.error(error);} );
  },


  // request the users location
  requestLocation: function(afterSuccess) {
    console.log("requestLocation");

    if (isConnected()) {
      if (!this.isRequestingLocation) {
        console.log("in requestLocation");
        this.isRequestingLocation = true;

        var onSuccess = function(position) {
          Location.coords = position.coords;
          Location.hasLocation = true;
          console.log("got coords: " + Location.coords.latitude + ", " + Location.coords.longitude);
          Location.stopRequestLocation();
          var latitude = (Location.coords != null) ? Location.coords.latitude : 0;
          var longitude = (Location.coords != null) ? Location.coords.longitude : 0;
          afterSuccess(latitude,longitude);
        };
        var onError = function (error) {
          console.log("error code: " + error.code);
          console.log("error message: " + error.message);
          Location.stopRequestLocation();
          confirm("Would you like to retry?", onConfirm, "Failure Requesting Location", ["Retry", "Cancel"]);
          function onConfirm(index) {
            if (index == 1) Location.requestLocation(afterSuccess);
          }
        };
        var pushLocation = function() {
          showSpinner("Requesting Location\nPlease Wait...");
          Location.watchIds.push(navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true }));
        }

        // change settings if we need to
        cordova.plugins.locationAccuracy.request(
          function(success) {
            App.accuracyStatus = Constants.AccuracyEnum.ENABLED;
            pushLocation()
          }, function(error) {
            console.log("error code: " + error.code + "\nerror message: " + error.message);
            App.accuracyStatus = Constants.AccuracyEnum.DISABLED;
            confirm("The app may not function as expected without the appropiate location settings enabled.", pushLocation, "Failure Changing Location Settings", ["Ok"]);
          }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      }
    } else {
      alert("Connect to the internet then click 'Retry' in order to request location.", alertDismissed, "No Internet Connection", "Retry");
      function alertDismissed() {
        //Location.requestLocation(afterSuccess);
      }
    }
  },


  // stop requesting the users location
  stopRequestLocation: function() {
    console.log("stopRequestLocation");
    this.isRequestingLocation = false;
    hideSpinner();
    var l = this.watchIds.length;
    for (var i = l-1; i >= 0; i--) {
      navigator.geolocation.clearWatch(this.watchIds[i]);
      this.watchIds.pop();
    }
  }

}
