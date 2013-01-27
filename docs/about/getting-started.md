## 바스아이오를 이용한 하이브리드 앱 만들기

### 기본 페이지 템플릿 생성

##### 1단계 - 기본 페이지 구성

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

### 기본 프로젝트 생성하기
* 프로젝트 생성
* SDK 다운로드
* HTML/JS 소스 생성
* 초기화 코드

### 좀더 빠르게
* boilerplate 다운로드