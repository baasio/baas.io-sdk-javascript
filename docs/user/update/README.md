## 로그인 된 유저 정보 업데이트

유저 정보 업데이트는 로그인된 상태에서만 가능하기 때문에 [로그인한 유저 정보 가져오기](../update)를 먼저 읽어보아야 한다.

회원 정보를 가지고 있는 웹 서비스나 앱이라면 기본적으로 제공하는 것이 회원정보 수정기능이다. 회원정보도 생성과 마찬가지로 [엔티티 업데이트]()하는 방법과 동일하다.

``` js
myFirstApp.getLoggedInUser(function(err, data, user) {
	if(err) {
		//인증된 유저 정보 없음
	} else {
		//인증된 유저 정보 존재
		
		user.set('phone', '010-xxxx-xxxx');
		user.save(function(err) {
			if (err) {
				//업데이트 실패
			} else {
				//업데이트 성공

				alert('업데이트된 유저 폰 번호는 '+ user.get('phone') +' 입니다.');
			}
		});	
	}
});
```

위의 코드는 새로운 유저를 생성한 