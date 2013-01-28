## 앱 유저 생성

앱을 사용하는 유저를 등록하는 것은 `user` 타입의 컬랙션에 엔티티를 추가하는 것과 동일하다.

`user` 타입의 컬랙션은 baas.io 에서 앱을 생성하면 자동으로 생성되는 컬랙션이다. 앱이 회원 기반으로 동작해야 한다면 `users` 컬랙션을 이용하면 편리하고 다양한 기능들을 함께 제공받을 수 있게 된다. 자세한 사항은 [개발자 가이드](https://baas.io/docs/ko/devguide/) 를 참고하세요.

자 그럼 유저를 생성해보자.

``` js
var myFirstApp = new Baas.IO({
	orgName: 'YOUR_BAAS_IO_ID',		// baas.io ID
	appName: 'YOUR_BAAS_APP_ID',	// baas.io Application ID
  logging: false,
  buildCurl: false
});

var newUser = {
	type: 'users',
	username: 'User Name',
	password: 'xxxxxxx',
	email: 'newUser@baas.io'
}

myFirstApp.createEntity(newUser, function(err, newUser) {
	if(err) {
		//유저 생성 실패
	} else {
		//유저 생성 성공
		alert(newUser.get('username')); // User Name
	}
});
```