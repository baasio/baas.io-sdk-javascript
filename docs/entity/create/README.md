## 엔티티 생성하기

baas.io 에서 엔티티를 가장 쉽게 설명하면 JSON 객체라고 할 수 있다.  그냥 내가 저장하고 싶은 정보 객체를 엔티티로 이해하면 된다.

``` js
var entity = {
	name: 'baas.io'
};
```

위의 `entity` 변수는 `name` 이라는 키에 `baas.io` 라는 문자열 값이 지정된 자바스크립트 객체인데 이 객체가 엔티티라고 한다.

자 그럼 '1951년형 페라리 자동차' 엔티티를 생성해보자.

``` js
var entity = {
	type: 'cars',
	name: 'ferrari',
	year: 1851
}
```

이제 생성된 엔티티를 자바스크립트 SDK 를 이용해서 데이터베이스에 저장해보자.

먼저 저장 할 애플리케이션 인스턴스를 생성해야 한다. 

``` js
var myFirstApp = new Baas.IO({
	orgName: 'YOUR_BAAS_IO_ID',		// baas.io ID
	appName: 'YOUR_BAAS_APP_ID',	// baas.io Application ID
  logging: false,
  buildCurl: false
});
```

생성한 `myFirstApp` 인스턴스에 위에서 생성한 '1951년형 페라리 자동차' 엔티티를 생성해보자.

``` js
myFirstApp.createEntity(entity, callback);
```

생성한 앱 인스턴스에는 엔티티를 생성하는 `createEntity` 메소드를 제공하는데 2개의 파라미터를 전달해야 한다.  생성할 엔티티 `entity` 와 콜백함수 `callback` 이다. 

``` js
var entity = {
	type: 'cars',
	name: 'ferrari',
	year: 1851
};

myFirstApp.createEntity(entity, function(err, car) {
	if(err) {
		//실패
	} else {
		//성공
	}	
});
```

위의 코드에는 콜백함수를 좀더 자세히 정의하였다.  콜백함수는 `createEntity` 함수 처리가 완료되고 난 후 비동기로 호출되는 함수로 2개의 인자로 전달된다.

첫번째 인자로 `err` 는 `createEntity` 처리 과정 중 오류가 발생했을 때 에러 객체를 전달해 준다. 그리고 두번째 인자 인 `car` 는 Object 타입으로 백엔드에 저장된 엔티티 정보를 반환해 준다. 추가적으로 `entity` 와 `car`는 다른 객체이다. 

위의 예시는 `Baas.IO` 인스턴스를 이용한 방식으로 users 나 devices 와 같은 컬랙션등에 생성할 때 유용하다. 하지만 앱에서는 대부분 컬랙션을 기준으로 엔티티를 추가하고 삭제하고 변경한다.

* [콜랙션 관점에서 엔티티 추가]() 문서에서는 `Baas.Collection` 인스턴스를 이용해 엔티티를 추가하는 방법도 제공한다.

생성하는 방법을 알았으니 엔티티 정보를 변경해보자.