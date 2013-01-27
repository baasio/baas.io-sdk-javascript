## 컬랙션을 한층 더 업그레이드 하기

컬랙션은 수 많은 속성을 갖는 엔티티들의 집합체이다. 일반적인 데이터베이스 시스템에서와 같이 쿼리의 `where` 조건문을 이용해 컬랙션 정보를 가져올 수 있지만 SDK 에서는 좀 더 편하게 사용할 수 있도록 요청 시 `qs` 옵션을 추가하면 된다.

먼저 코드를 살펴보자.
컬랙션 생성과 엔티티 정보 가져오는 코드와 동일하다. 

``` js
var myFirstApp = new Baas.IO({
	orgName: 'YOUR_BAAS_IO_ID',		// baas.io ID
	appName: 'YOUR_BAAS_APP_ID',	// baas.io Application ID
  logging: false,
  buildCurl: false
});

var options = {
	type: "mycollections",
	//created 키 값으로 정렬
	qs: { "ql": "order by created desc" }
};

myFirstApp.createCollection(options, function(err, items) {
	if(err) {
		//실패
	} else {
		//성공
	}
});
```

위의 코드를 수행하면 `mycollections` 에 있는 내용을 `created` 라는 키 값을 기준으로 내림차순 정렬을 하게 된다. 흔히 SQL 의 `where` 구문과 동일하다.

### 쿼리 주요기능

baas.io 의 쿼리 기능의 특징은 크게 다음과 같다.

* 정렬
* 복합 질의를 위한 연산자
* SQL Like 질의
* 필터

> SDK 쿼리 기능에 대한 자세한 사항은 준비중입니다.

쿼리와 관련된 자세한 내용은 [개발가이드 - 데이터 질의하기](https://baas.io/docs/ko/devguide/query.html)에서 볼 수 있다.