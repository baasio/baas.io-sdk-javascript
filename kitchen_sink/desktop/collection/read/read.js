$(document).ready(function() {

	var myFirstApp = new Baas.IO({
		orgName: YOUR_BAAS_IO_ID,
		appName: YOUR_BAAS_APP_ID,
    logging: false, //optional - turn on logging, off by default
    buildCurl: false //optional - turn on curl commands, off by default
  });

	var options = {
		type: "mycollections",
		qs: { "ql": "order by created desc" }
	};

	myFirstApp.createCollection(options, function(err, cars) {
		if(err) {
			//실패
		} else {
			//성공
			var car;
			while(cars.hasNextEntity()) {
				car = cars.getNextEntity();
				alert(car.get('name'));
			}
		}
	});

});

