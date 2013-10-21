## Quickstart

```javascript
<DOCTYPE html>
<html>
    <head>
        <script src="http://baasio.github.io/baas.io-sdk-javascript/baas.io.min.js"></script>
        <script type="text/javascript">


            // Initializing the SDK
            var io = new Baas.IO({
                orgName:'yourorgname', // Your baas.io organization name (or baas.io username for App Services)
                appName:'sandbox' // Your baas.io app name
            });

            // members colllection을 만들고, 데이터를 읽음
            var options = {
                type:'members',
                qs:{ql:'order by created DESC'}
            }

            var members;

            io.createCollection(options, function (err, members) {
                if (err) {
                    alert("Couldn't get the list of members.");
                } else {
                    while(members.hasNextEntity()) {
                        var member = members.getNextEntity();
                        alert(member.get("name")); // Output the name of the members
                    }
                }
            });

            // member 의 추가를 원한다면, 아래의 4줄의 주석을 제거

            // member = { "title": "r2fresh" };
            // members.addEntity(member, function (error, response) {
            //  if (error) { alert("Couldn't add the member.");
            //  } else { alert("The member was added."); } });
        </script>
    </head>
    <body></body>
</html>
```

## Overview

앱 서비스에 연결하여 javascript/html 또는 hybrid app에 사용을 간단하게 해주는 오픈 소스 SDK다.

Repository 주소 :

https://github.com/baasio/baas.io-sdk-javascript

Package 다운로드 주소 :

Download as a zip file: https://github.com/baasio/baas.io-sdk-javascript/archive/master.zip

Download as a tar.gz file: https://github.com/baasio/baas.io-sdk-javascript/archive/master.tar.gz

baas.io 앱 개발에 대한 더 많은 정보 :

https://baas.io/docs/ko/devguide/

## Version

Current Version: 0.9.0

변경 된 내용:

https://github.com/baasio/baas.io-sdk-javascript/blob/master/changelog.md

## Installing

먼저 SDK를 다운로드하여 프로젝트에 baas.io.js 파일을 추가합니다. 이 파일은 SDK의 root에 있다. Html 의 상단에 추가한다. (head 태그 사이에)

```
<script src="path/to/baas.io.js" type="text/javascript"></script>
```

## Validation

유효성 검사를 위한 확장 js파일은 앱에서 사용할 수 있다.

파일 위치 :

```
/extensions/usergrid.session.js
```

HTML파일의 상단에 파일을 추가 - SDK를 추가 한 다음에 :

```
<script src="path/to/baas.io.js" type="text/javascript"></script>
<script src="path/to/extensions/baas.io.validation.js" type="text/javascript"></script>
```

username, passwords 그리고 많은 일반적인 타입의 유효성 확인하는 다양한 함수가 있습니다. 프로젝트에 사용하기 위해 수정을 하시거나 복사를 하여 사용할 수 있습니다.

## cURL

cURL은 API를 직접 호출하는 가장 좋은 방법이다. IO을 선언할때 options에 buildCurl를 추가하면 된다.

```
var io = new Baas.IO({
    orgName:'yourorgname',
    appName:'sandbox',
    logging: true, // Optional - turn on logging, off by default
    buildCurl: true // Optional - turn on curl commands, off by default
});
```
만약에 buildCurl의 값을 true로 하면, curl의 명령어를 만들고, console.log를 통해 명령어를 볼 수 있다.

cURL의 더 자세한 내용 :

http://curl.haxx.se/

## Contributing

SDK의 향상을 위한 당신의 참여를 환영합니다.

참여 하시는 방법 :

1. SDK를 Fork한다.
2. 새로운 Branch를 생성한다.(git checkout -b my-new-feature).
3. 코드를 변경하고, 변경된 내용을 commit 한다.(git commit -am '변경된 간단한 내용').
4. 변경된 내용의 Branch를 Push한다.(git push origin my-new-feature).
5. Pull Request를 만들어 요청한다.(변경된 내용과 왜 수정하였는지를 적음)

## Comments/Question

SDK의 도움말

https://baas.io/docs/ko/javascript/index.html

SDK 관련 질문 또는 검색

https://baas.io/support/

## Copyright

Copyright 2013 baas.io

Licensed under the Apache License, Version 2.0 (the "License"); you may not use thisfile except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
