## 컬랙션에 엔티티 추가하기
RDMS 에서 말하는 테이블이 컬랙션이라 할 수 있고 테이블을 구성하는 하나 하나의 ROW 가 엔티티라고 할 수 있다.  하지만 baas.io 는 이것을 엔티티라고 부른다.

컬랙션에 앱에서 생성한 구조적 정보를 엔티티로 저장하게 된다.

자 앞서 생성했던 `mycollctions` 컬랙션에 자동차 엔티티를 넣는 방법을 좀더 자세히 살펴보도록 하자.

### 앱 인스턴스 관점에서 엔티티 생성

먼저 코드를 보자.

```
var myFirstApp = new Baas.IO({
	orgName: 'YOUR_BAAS_IO_ID',		// baas.io ID
	appName: 'YOUR_BAAS_APP_ID',	// baas.io Application ID
  logging: false,
  buildCurl: false
});

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

위의 코드는 [컬랙션에 엔티티 목록 가져오기]() 문서를 통해서 이미 보았을 것이다.  `new Baas.IO` 를 통해 애플리케이션 인스턴스를 생성하고 `createEntity` 메소드를 통해 지정한 `type` 즉 컬랙션에 엔티티를 생성하는 방법이 있다. 이것은 애플리케이션 관점에서 생성하는 방법이다.

이런 방식은 단일 컬랙션만 관리하면 되는 앱에서는 유용하지만 다수의 콜랙션의 연관관계가 필요한 복잡한 앱에서는 불편하다.

컬랙션이 여러개 사용되는 앱에서는 컬랙션 단위에서 엔티티가 추가되거나 변경, 삭제되는 경우가 많이 발 생한다.

다음에 소개할 내용은 컬랙션 인스턴스를 생성하고 컬랙션 객체에 엔티티를 관리하는 방법을 소개한다.

* 컬랙션 인스턴스 생성

컬랙션 인스턴스 생성은 `createCollection` 의 콜백함수로 전달된 두번째 인자이다.  다음의 코드를 보자.

> 유의사항
>
> 아래의 코드를 직접 실행해보기 위해서는 [https://baas.io](https://baas.io) 데이터브라우저에 `foocollections` 와 `barcollections` 컬랙션이 이미 존재해야 한다.

```
var fooCollection;	// foo collection 인스턴스
var barCollection;	// bar collection 인스턴스

var fooOptions = {
	type: "foocollections"
};

var barOptions = {
	type: "barcollections"
};

myFirstApp.createCollection(fooOptions, function(err, collectionObject) {
		//foo 컬랙션 인스턴스를 글로벌 변수에 할당
		fooCollection = collectionObject;
});

myFirstApp.createCollection(barOptions, function(err, collectionObject) {
		//bar 컬랙션 인스턴스를 글로벌 변수에 할당
		barCollection = collectionObject;
});
```

위의 코드는 `foocollections`, `barcollections` 두개의 인스턴스를 만드는 코드이다. 인스턴스가 생성되었다면 이제 `foocollections` 에 엔티티를 생성해보자.

* 콜랙션에 엔티티 추가

```
var options = {
	name: 'ferrari',
	year: 1851
};

fooCollection.addEntity(options, function(err, entity) {
  if (err){
    //에러
    alert('실패');
  } else {
    //성공
    alert('성공');

    // 콜백함수 두번째 인자로 넘어온 entity 는 Baas.Entity 인스턴스로 전달된다.
  }
});
```

> 유의사항
>
> 만약 생성이 되지 않고 `"Uncaught TypeError: Cannot read property 'length' of undefined"` 에러나 `401 unauthorize` 에러가 발생한다면 해당 컬렉션의 권한을 살펴볼 필요가 있다.
> 현재 유저에게 해당 컬렉션에 엔티티를 추가할 수 있는 `create` 권한이 부여되어 있는지 데이터브라우저 `role` 콜렉션에서 편집할 수 있다.
>
> 롤과 퍼미션과 관련해서는 별도의 페이지를 설명할 에정이다.