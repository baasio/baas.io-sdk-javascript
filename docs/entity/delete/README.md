## 엔티티 삭제하기

백엔드에 저장된 엔티티의 경우 다음과 같은 정보를 기본적으로 갖게 된다. 이것은 백엔드 상에 유니크한 포인트를 가리킬 수 있는 `uuid`, 콜랙션 정보를 가리키는 `type`, 엔티티가 생성된 시간과 변경이 일어난 최근 시간 그리고 해당 엔티티와 연관된 메타 정보이다.

엔티티 데이터 모델은 baas.io 개발자 가이드 [데이터 모델](https://baas.io/docs/ko/devguide/data-model.html) 문서에서 좀더 자세히 참조할 수 있다.

``` js
{
	uuid: 'b80q71ea-652c-11e2-bdac-06xbd80000xa',
	type: 'mycollection',
	created: 1358412872624,
	modified: 1358412872624,
	metadata: {}
}
```

이런 엔티티의 기본 데이터 모델은 최초 생성 시 부여되고 이후 엔티티 정보를 변경하거나 삭제할 때 꼭 필요하다.

자 그러면 코드를 통해 삭제 방법을 이해해보자.

``` js
var myFirstApp = new Baas.IO({
	orgName: 'YOUR_BAAS_IO_ID',		// baas.io ID
	appName: 'YOUR_BAAS_APP_ID',	// baas.io Application ID
  logging: false,
  buildCurl: false
});

var options = {
	client: myFirstApp,
	data: {
		type: 'mycollection',
		uuid: 'b80a71aa-652a-11e2-bdac-06ebb80000ba'
	}	
}

var entity = new Baas.Entity(options);
entity.destroy(function(err) {
	if (err) {
		alert('엔티티 삭제 실패');
	} else {
		alert('엔티티 삭제 성공');
	}
});
```

`mycollection` 타입의 컬랙션에서 `uuid`가 `b80a71aa-652a-11e2-bdac-06ebb80000ba` 인 엔티티를 삭제하는 코드이다.

