## 엔티티 가져오기

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
