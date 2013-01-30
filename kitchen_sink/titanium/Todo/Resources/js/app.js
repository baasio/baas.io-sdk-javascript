$(document).ready(function () {

  /**
   * 애플리케이션 초기화
   * @type {Baas}
   */
	var myFirstApp = new Baas.IO({
		orgName: 'YOUR_BAAS_IO_ID',
		appName: 'YOUR_APPLICATION_ID'
	});


  /**
   * 로그인
   * @param  {[type]} err [description]
   * @return {[type]}     [description]
   */
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

  /**
   * 엔티티 생성
   */
  var options = {
    type: 'family',
    name: 'toto'
  };

  function createEntityHandler(err, father) {
    if(err) {
      //생성 실패
    } else {
      //생성 성공
      father.set('age', 54);

      var prop = {
        hasCar: true,
        company: 'KTH'
      };

      father.set(prop);

      father.save(function(err) {
        if(err) {}
        else {}
      });
    }
  }
  myFirstApp.createEntity(data, createEntityHandler);
  
});