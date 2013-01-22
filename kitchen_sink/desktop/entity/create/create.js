$(document).ready(function () {

  /**
   * 애플리케이션 초기화
   * @type {Baas}
   */
	var myFirstApp = new Baas.IO({
		orgName: YOUR_BAAS_IO_ID,
		appName: YOUR_BAAS_APP_ID
	});

	//유저 엔티티 데이터 모델
	var options = {
	    type:'users',
	    username:'YOUR_ACCOUNT_NAME',
	    password:'YOUR_PASSWORD',
	    name:'YOUR_REAL_NAME',
	    email:'YOUR_EMAIL'
	}

	//엔티티 생성
	myFirstApp.createEntity(options, function (err, account) {
	    if (err){
	        //에러
	        alert('실패');
	    } else {
	        //성공
	        alert('성공');
	    }
	});

});