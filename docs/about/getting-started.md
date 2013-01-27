## 바스아이오를 이용한 하이브리드 앱 만들기

### 1단계 - 설치(Installation)

#### 소스를 이용하는 방법
``` 
git clone https://github.com/kthcorp/baas.io-SDK-JavaScript.git
cp ./baas.io-SDK-JavaScript/baas.io.js /path/to/your-project
```

#### 다운로드하는 방법 
* [Development Version(0.4.0)](./baas.io-SDK-JavaScript/blob/devel/baas.io.js)	- 개발/디버깅용
* [Production Version(0.4.0)](./baas.io-SDK-JavaScript/blob/devel/baas.io.min.js) - 압축/배포용

#### 스타트업 프로젝트로 생성하기
> 준비중입니다.

### 기본 페이지 템플릿 생성

##### 2단계 - 기본 페이지 구성

``` html
<!DOCTYPE html> 
<html> 
<head> 
	<meta charset="utf-8">
	<title>Page Title</title> 
	
	<meta name="viewport" content="width=device-width, initial-scale=1"> 

	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.0-beta.1/jquery.mobile-1.3.0-beta.1.min.css" />
	<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.3.0-beta.1/jquery.mobile-1.3.0-beta.1.min.js"></script>
	<script src="js/baas.io-0.1.0.min.js"></script>
</head> 

<body> 
	...사용자 콘텐츠는 이곳에 입력해주세요...
</body>
</html>
```

>[ jQuery Mobile - Quick start guide](http://jquerymobile.com/demos/1.3.0-beta.1/docs/about/getting-started.html) 문서를 참고하시면 레이아웃 구성이 좀더 쉬워요.

##### 2 단계 - 레이아웃 디자인

``` html
<div data-role="page">
	<div data-role="header">
		<h1>My Title</h1>
	</div><!-- /header -->

	<div data-role="content">	
		<p>Hello world</p>		
	</div><!-- /content -->

</div><!-- /page -->
```

##### 3 단계 - 폼 요소 꾸미기

``` html
<a href="#" data-role="button" data-icon="star" data-theme="a">Button</a>
```

## 코딩하기

* app.js

```
$(document).ready(function () {

  /**
   * 애플리케이션 초기화
   * @type {Baas}
   */
	var myFirstApp = new Baas.IO({
		orgName: 'YOUR_BAAS_IO_ID',			//baas.io UUID
		appName: 'YOUR_APPLICATION_ID'	//Application UUID
	});

});
```

위의 코드는 SDK를 이용해 baas.io 를 이용하기 위한 가장 기본적인 코드이다. 
`Baas.IO` 인스턴스 생성할 때 `baas.io` UUID `application` UUID 를 넣어주면 된다.

애플리케이션 엔드 포인트 정보는 포털 사이트에 애플리케이션 대쉬보드에 확인 가능하다.

![애플리케이션 엔드 포인트](https://raw.github.com/kthcorp/baas.io-SDK-JavaScript/devel/docs/_assets/endpoint.png)

* 로그인

```
	...

  function loginHandler(err) {
    if (err) {
      //로그인 실패
    } else {
      //로그인 성공
      
      //로그인 정보 가져오기
      myFirstApp.getLoggedInUser(function(err, data, user)) {
        alert(user.name);
      }
    }
  }

  myFirstApp.login('USERNAME', 'PASSWORD', loginHandler);
  
  ...
```

간단한 로그인 코드를 추가해보자.  사실 위의 코드가 성공적으로 실행하라면 SDK 사용법과 포털 사이트에 애플리케이션 대쉬보드를 활용하면 앱 개발이 더욱 편리해진다.