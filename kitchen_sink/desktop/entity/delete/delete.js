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
			uuid: 'b80a71aa-652a-11e2-bdac-06ebb80000ba'
		}	
	}

	var entity = new Baas.Entity(options);
	entity.destroy(function(err) {
		if (err) {
			alert('엔티티 삭제 실패');
		} else {
			alert('엔티티 삭제 성공');
		}
	});
	
});