$(document).ready(function() {

	var myFirstApp = new Baas.IO({
		orgName: YOUR_BAAS_IO_ID,
		appName: YOUR_BAAS_APP_ID,
    logging: true, //optional - turn on logging, off by default
    buildCurl: false //optional - turn on curl commands, off by default
  });

	// var options = {
	// 	type: "mycollection",
	// 	qs: { "ql": "order by created desc" }
	// };

	// myFirstApp.createCollection(options, function(err, cars) {
	// 	if(err) {
	// 		//실패
	// 	} else {
	// 		//성공
	// 		var car;
	// 		while(cars.hasNextEntity()) {
	// 			car = cars.getNextEntity();
	// 			alert(car.get('name'));
	// 		}
	// 	}
	// });

	var options = {
		client: myFirstApp,
		type: 'mycollection',
		qs: { "ql": "order by created desc" }
	}

	var myCollection = new Baas.Collection(options, function(err) {
		if (err) {
			alert('컬랙션 정보 가지오기 실패');
		} else {
			alert('컬랙션 정보 가지오기 성공');
			
			var car;
			while(myCollection.hasNextEntity()) {
				car = myCollection.getNextEntity();
				alert(car.get('name'));
			}
		}
	});

});

