$(document).ready(function() {

	var myFirstApp = new Baas.IO({
		orgName: YOUR_BAAS_IO_ID,
		appName: YOUR_BAAS_APP_ID,
    logging: false, //optional - turn on logging, off by default
    buildCurl: false //optional - turn on curl commands, off by default
  });

	var myCollection;		//collection 

	var options = {
		type: "mycollection"
	};

	myFirstApp.createCollection(options, function(err, items) {
		if(err) {
			//실패
			alert('실패');
		} else {
			//성공
			alert('성공');

			myCollection = items;
			createEntity();
		}
	});

	function createEntity() {
		var options = {
			name: 'ferrari',
			year: 1851
		};

		if(myCollection) {
			myCollection.addEntity(options, function(err, car) {
				console.log(car);
				alert('엔티티 uuid 는 '+ car.get('uuid'));
			});
		}
	}

});

