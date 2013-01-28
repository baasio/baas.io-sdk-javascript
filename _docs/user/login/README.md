## 앱 유저 로그인

코드부터 보자.

``` js
var myFirstApp = new Baas.IO({
	orgName: 'YOUR_BAAS_IO_ID',		// baas.io ID
	appName: 'YOUR_BAAS_APP_ID',	// baas.io Application ID
  logging: false,
  buildCurl: false
});

myFirstApp.login(username, password, function(err) {
	if(err) {
		//로그인 실패	
	} else {
		//로그인 성공
	}
});
```

코드에서도 알 수 있듯이 로그인은 그야말로 간단하다. 

`myFirstApp.login` 메소드에 `username` 과 `password` 를 전달하면 콜백함수에 `err` 객체를 전달해준다.  만약 이 `err` 객체가 존재하면 로그인에 실패하고 없다면 성공한 것이다.

그런데 이상한점이 있다.

## 로그인한 유저 정보 가져오기

로그인이 정상적으로 완료되었다면 로그인 정보를 접근할 수 있도록 콜백함수에 받을 수 있어야 할 것 같지만 아니다.

`Baas.IO` 클래스는 앱 개발을 위해 가장 중요한 객체로 내부적으로 인증 정보와 baas.io 백엔드에 필요한 엔드 포인트 관리 및 통신을 위한 기능들을 담고 있다.

즉, 위의 콜백에서 인증이 성공했다면 별도의 메소드를 통해서 인증된 유저 정보를 가져올 수 있다.

`getLoggedInUser` 메소드이다.

``` js
myFirstApp.getLoggedInUser(function(err, data, user) {
	if(err) {
		//인증된 유저 정보 없음
	} else {
		//인증된 유저 정보 존재
		
		alert(user.get('email')); // user@email.com
	}
});
```

`getLoggedInUser` 메소드는 콜백함수를 파라미터로 호출해야 한다. 서버에서 인증 정보를 가져오고 나서 콜백함수로 3개의 인자를 전달해준다. 에러 객체 `err`, 서버 응답 로우 데이터 `data` 그리고 세번째 인자는 엔티티가 넘어온다.

이 메소드를 통해 현재 로그인된 유저 정보를 얻을 수 있다.

다음은 [유저 정보 업데이트 하기]() 에 대해서 알아보자.

## 함께 읽어보세요.

* [baas.io 인증 시스템](https://baas.io/docs/ko/devguide/authentication.html)