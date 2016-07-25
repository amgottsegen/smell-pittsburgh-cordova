
var isDeviceReady = false;

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("Received Device Ready Event");
		isDeviceReady = true;
		showSpinner();
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
		requestLocation();
		
		function onResume() {
			requestLocation();
		}
		
		function onPause() {
			$('#submitReport').attr('disabled', 'true');
		}
    }
};

app.initialize();
 
 
 