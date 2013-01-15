# baas.io JSDK

## 일정
* 12월 13일 : 개발 환경 및 테스트, 리파지토리 설정
* 12월 31일 : v0.0.1 릴리즈
* 2013년 1월 29일

## 로드맵

#### 브라우저 (2013 1/Q)
* baas.Core
* baas.User
* baas.Entity
* baas.Collection
* baas.Query
* ----------------( usergrid sdk 제공 )
* baas.Push
* baas.Push.Message
* baas.File
* baas.Help
* baas.Role
* baas.Releation

#### Node.js SDK (2013 2/Q)
#### 하이브리드 애플리케이션 도그푸딩 (2013 3/Q)
#### 에코 시스템 확장 (2013 4/Q)

## 아키텍쳐
* 네이티브 UI 가 없는 자바스크립트 SDK 의 경우 잘 알려진 웹용 모바일 애플리케이션 프레임워크 혹은 라이브러리 구조에 적합하도록 설계한다.
* 키친 싱크 앱을 SDK 개발과 병행 제작해보며 실질적인 요구 사항을 분석하고 SDK 에 반영되도록 한다.

### Core
* underscore.js
* [http://underscorejs.org/](http://underscorejs.org/)
* Event Emitter
    - https://github.com/Wolfy87/EventEmitter
    - https://github.com/melanke/Watch.JS

## 테스팅
* mocha + chai
* [http://visionmedia.github.com/mocha/](http://visionmedia.github.com/mocha/)

## UI
* Sencha Touch
* jQuery Mobile

## 하이브리드 앱 빌드 자동화
* Titanium
* PhoneGap
* Appspresso

## Grunt.js 자동화

* grunt.js 용 모듈 필요

```
$ npm install grunt-exec
```

* minify, obfuscating

> `grunt-exec` 모듈을 이용해서 uglify.js 스크립트를 CLI 에서 바로 실행할 수 있도록 개선
	- grunt : 기본적인 최적화
	- grunt release : release 용 생성 `baas.io.js`, `baas.io.min.js`
	- grunt kitchen : kitchensink 앱에 최신의 라이브러리가 적용됨

### 빌드

```
$ grunt

# 혹은 다음과 같이 실행

$ grunt default
```

위와 같이 실행하면 `src` 디렉토리에 존재하는 분리된 라이브러리들을 하나로 합치고 uglifyjs 를 이용한 최적화가 진행된 후 `dest` 폴더에 개발용 `baas.io.js`, 배포용 `baas.io.min.js` 가 생성된다.

### 배포

```
$ grunt release
```

위와 같이 실행하면 `grunt default` 로 실행한 파일을 기준으로 생성된 파일으로 배포용 파일을 생성한다. 

배포용 파일을 생성할 때는 의존성 있는 `underscore.js` 와 병합을 하거나 상단 라이센스, 버젼과 관련된 베너 코멘트가 추가된다.

### 기타

```
$ grunt kitchen
```

위와 같이 실행하면 `grunt default` 로 실행한 파일을 기준으로 생성된 파일을 기준으로 kitchensink 앱에 최신의 빌드 파일을 적용한다.

## KitchenSink App

`node-webkit` 를 github.com 을 참조하여 로컬 환경에 설치되어 있어야 한다. 

* [node-webkit](https://github.com/rogerwang/node-webkit)

참고로 `node-webkit` 은 node 모듈이 아닌 구글 Chromium 브라우저를 임베디드한 웹킷 엔진으로 자바스크립트와 HTML 로 개발된 애플리케이션을 데스크탑에서 독립실행형 애플리케이션으로 동작할 수 있도록 해주는 실행 환경이다.

### 실행방법

```
$ cd kitchens_sink
$ nw desktop
````

## 기타 단기 목표
* 도그푸팅을 통해 사내에서 사용할 수 있는 유용한 앱을 1개
* 키친싱크 앱 개발을 통한 SDK 가이드 문서화와 예시를 동시 제공

## changelog

### v0.1.0
* grunt.js 를 통한 minify, obfuscating, build, release 자동화