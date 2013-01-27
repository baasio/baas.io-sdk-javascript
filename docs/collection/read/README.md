## 컬랙션에 엔티티 목록 가져오기

흔히 NOSql 에서 데이터베이스에 하나의 다큐멘트의 개념인 JSON 포맷은 baas.io 에서는 엔티티로 사용되면 SDK에도 엔티티라는 개념을 그대로 사용하고 있다.

자 그럼 앞서 생성한 "mycollection" 콜랙션에 어떤 엔티티들이 담겨 있는지 요청해보자.

> 콜렉션 명이 "mycollections" 복수형임을 유의하자.


``` js
var myFirstApp = new Baas.IO({
	orgName: 'YOUR_BAAS_IO_ID',		// baas.io ID
	appName: 'YOUR_BAAS_APP_ID',	// baas.io Application ID
  logging: false,
  buildCurl: false
});

var options = {
	type: "mycollections"
};

myFirstApp.createCollection(options, function(err, items) {
	if(err) {
		//실패
	} else {
		//성공
		var item;
		while(items.hasNextEntity()) {
			item = items.getNextEntity();

			alert(item.get('name'));
		}
	}
});
```

아마 위의 코드로 "mycollections" 의 콜렉션을 요청했다면 결과에 아무런 값도 없을 것이다.

``` js
myFirstApp.createCollection(options, function(err, items) {
	console.log(items._list.length); // 0
});
```

자 그럼 콜랙션에 엔티티를 생성해보자.

## 컬랙션에 엔티티 생성
먼저, 생성할 데이터를 정의해보자.

``` js
var options = {
	type: "mycollections",
	name: "benz",
	year: 1967
}
```

데이터는 `type` 이라는 값에 컬랙션 명을 지정하고 나머지는 `key`:`value` 형태로 나열해주면 된다. 복잡한 JSON 포맷이라고 하여도 상관없지만 여기서는 설명을 위해서 `name` 과 `year` 를 갖는 엔티티를 생성할 예정이다.

다음의 코드를 보자.

앞서 소개한 컬랙션에 포함된 엔티티를 가져오는 단계에서 `createCollection` 메소드와 유사하다.

``` js
//엔티티 생성
myFirstApp.createEntity(options, function (err, items) {
  if (err){
    //에러
    alert('실패');
  } else {
    //성공
    alert('성공');
  }
});
```

위의 코드를 실행했다면 `애플리케이션 대쉬보드 > 데이터브라우저` 에서 새롭게 생성된 엔티티를 확인할 수 있을 것이다.

물론 **컬랙션에 엔티티 목록 가져오기** 에소 소개한 소스를 다시 실행해 보면 업데이트된 내용도 확인할 수 있을 것이다.


## 콜렉션의 포함된 엔티티 접근

콜랙션은 일반적으로 많은 엔티티를 포함하고 있다. 다음은 컬랙션에 포함된 엔티티에 접근하는 가장 기본적인 예제 코드이다.

``` js
myFirstApp.createCollection(options, function (err, items) {
  if (err){
    //에러
    alert('실패');
  } else {
    //성공
		while(items.hasNextEntity()) {
	    var car = items.getNextEntity();
	    var name = car.get('name');
	    notice('이 자동차는 "'+ name +'" 이라고 부른다.');
		}
  }
});
```

코드에서도 알 수 있듯이 `createCollection` 의 콜백 함수에 전달된 `items` 인자에는 엔티티 정보를 담고 있다. 또한 기본적으로 SDK에서 서버의 응답을 랩핑한 컬랙션 모델으로 몇 가지 유용한 메소드들을 함께 제공한다.

위의 코드에 `items.hasNextEntity` 메소드는 엔티티 유무를 체크하는 메소드이다. while 문을 통해 모든 엔티티를 반복해서 접근할 수 있다.

좀 더 자세한 SDK 사용법은 자세히 다룰 예정이지만 먼저 참고하고 싶다면 API Reference 를 참고 바란다.

* [엔티티 모델]()
* [컬랙션 모델]() 