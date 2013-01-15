## baas.io JSDK

### 일정
* 12월 13일 : 개발 환경 및 테스트, 리파지토리 설정
* 12월 31일 : v0.0.1 릴리즈

### 로드맵
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

### 아키텍쳐
* 네이티브 UI 가 없는 자바스크립트 SDK 의 경우 잘 알려진 웹용 모바일 애플리케이션 프레임워크 혹은 라이브러리 구조에 적합하도록 설계한다.
* 키친 싱크 앱을 SDK 개발과 병행 제작해보며 실질적인 요구 사항을 분석하고 SDK 에 반영되도록 한다.

##### UI
* Sencha Touch
* jQuery Mobile

##### 하이브리드 앱 빌드 자동화
* Titanium
* PhoneGap
* Appspresso

##### Core
* underscore.js
* [http://underscorejs.org/](http://underscorejs.org/)
* Event Emitter
    - https://github.com/Wolfy87/EventEmitter
    - https://github.com/melanke/Watch.JS

##### 테스팅
* mocha + chai
* [http://visionmedia.github.com/mocha/](http://visionmedia.github.com/mocha/)

### Grunt.js

```
$ npm install grunt-exec
```

* minify, obfuscating
> `grunt-exec` 모듈을 이용해서 uglify.js 스크립트를 CLI 에서 바로 실행할 수 있도록 개선
	- grunt : 기본적인 최적화
	- grunt release : release 용 생성 `baas.io.js`, `baas.io.min.js`
	- grunt kitchen : kitchensink 앱에 최신의 라이브러리가 적용됨

### KitchenSink App

`node-webkit` 를 github.com 을 참조하여 로컬 환경에 설치되어 있어야 한다.

* [node-webkit](https://github.com/rogerwang/node-webkit)

#### 실행방법

```
$ cd kitchens_sink
$ nw desktop
````

### 기타 단기 목표
* 도그푸팅을 통해 사내에서 사용할 수 있는 유용한 앱을 1개

## changelog

### v0.1.0
* grunt.js 를 통한 minify, obfuscating, build, release 자동화