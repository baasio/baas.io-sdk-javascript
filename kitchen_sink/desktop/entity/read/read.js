$(document).ready(function () {

  /**
   * 애플리케이션 초기화
   * @type {Baas}
   */
	var myFirstApp = new Baas.IO({
		orgName: YOUR_BAAS_IO_ID,
		appName: YOUR_BAAS_APP_ID,
    logging: true,
    buildCurl: false
	});

	var options = {
		client: myFirstApp,
		data: {
			type: 'mycollection',
			uuid: 'b80a71aa-652a-11e2-bdac-06ebb80000ba1'
		}	
	}

	var entity = new Baas.Entity(options);

	entity.fetch(function(err, car) {

		if (!err) {
			alert('엔티티의 name 값은: '+ entity.get('name'));
		} else {
			alert(err)
		}

	});

});