## 엔티티 업데이트

**엔티티 생성**에서 작성했던 코드를 바탕으로 엔티티에 새로운 값을 부여해보자.

```
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

		car.set('price', 800000000);
		car.set({
			options: {
				airback: true,
				audio: true,
				sunroof: true
			}
		});

		car.save(function(err) {
			if(err) {
				//엔티티 업데이트 실패
			} else {
				//엔티티 업데이트 성공
			}
		});
	}	
});
```

위의 코드에서 `createEntity` 의 콜백함수로 전달된 `car` 엔티티는 `Baas.IO.Entity` 의 인스턴스로 몇 가지 메소드를 제공한다.

여기에서 살펴볼 것은 `set` 과 `save` 메소드인데 앱 개발 시 가장 많이 사용하게 될 메소드이기도 하다.

엔티티에 새로운 값을 부여하는 것은 대부분의 라이브러리에서 'key', 'value' 를 설정하기 위해 사용하는 `set` 메소드 사용법과 동일하다.

아래 코드처럼 지정하면 된다.

```
car.set('key', 'value');
```

또한 다음의 형태도 가능하다.

```
car.set({
	key: value
});
```

이렇게 엔티티에 새로운 속성을 부여하였다면 이제 저장을 해보자.  `set` 메소드로 변경한 내용은 자바스크립트 객체에만 변경되고 백엔드에는 저장되지 않는다.

변경사항을 저장하는 것은 매우 간단한다. `save` 메소드를 이용하자.

```
car.save(callback);
```

`save` 메소드를 호출하면 서버에 업데이트된 엔티티 정보가 저장되고 `callback` 함수가 호출된다. 이 함수에는 `err` 인자만 존재하는데 서버에 저장되었는 지에 대한 성공과 실패 여부가 담겨있다.

여기까지 [엔티티 생성]()과 엔티티 정보 업데이트에 대해 알아보았다.