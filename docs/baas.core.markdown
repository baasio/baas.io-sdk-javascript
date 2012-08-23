
## Application

### Baas.app

애플리케이션의 organization 과 application 명을 입력한다.

```js
Baas.app('organization', 'application');
```

example

```js
var BS = Baas;
Baas.app('kth', 'pudding');
```

### Baas.credential
애플리케이션이 동작하기 위한 기본적인 서버 인증

```js
Baas.app('organization', 'application');
```

```js
var BS = Baas;
Baas.app('kth', 'pudding');
```
	
### Event
애플리케이션 자격 인증 성공과 실패에 대한 이벤트

#### credential_success

```js
Baas.on('credential_success', function(response) {
	//성공 시 처리
});
```

example

```js
var BS = Baas;
BS.app('kth', 'pudding');

Baas.on('credential_success', function(response) {
	alert('Credential Success, Access Token : '+ reponse.access_token);
});
```

#### credential_fail


```js
Baas.on('credential_fail', function(response) {
	//실패 시 처리
});
```

example

```js
var BS = Baas;
BS.app('kth', 'pudding');

Baas.on('credential_fail', function(response) {
	alert('Credential Fail : "'+ reponse.error_description +'"');
});
```