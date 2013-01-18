$(document).ready(function () {

	var myFirstApp = new Baas.IO({
		orgName: 'YOUR_BAAS_IO_ID',
		appName: 'YOUR_APPLICATION_ID'
	});

  function loginHandler(err) {
    if (err) {
      //로그인 실패
    } else {
      //로그인 성공
      
      //로그인 정보 가져오기
      myFirstApp.getLoggedInUser(function(err, data, user)) {
        alert(user.name);
      }
    }
  }

  myFirstApp.login('USERNAME', 'PASSWORD', loginHandler);

});