# 콜렉션 ( Collection )
애플리케이션의 다양한 데이터를 저장하기 위하여 baas.io에서는 컬랙션 기능을 제공합니다. 기본적으로 제공되는 컬랙션에는 users , group, roles 등의 backend API 와 추가적인 기능이 함께 동작되는 컬랙션과 개발자가 직접 생성한 사용자 정의 컬랙션으로 구분됩니다.

컬랙션은 앱 전용 데이터베이스로 이해하시면 되며, 데이터의 추가 / 삭제 / 변경 / 검색 의 기능이 제공됩니다.

모든 컬랙션은 baas.io 포털에서 제공되는 데이터 브라우져에서 컬랙션 생성/삭제, 엔터티 생성/변경/삭제, 컬랙션 접근 권한 관리, Export / Import 기능을 사용할 수 있으며, 접근 권한에 부합하는 Access Token 을 생성하면 REST API 로도 동일한 기능을 수행할 수 있습니다.

* [컬랙션 생성](https://github.com/kthcorp/collection/create)
* [컬랙션 가져오기](https://github.com/kthcorp/collection/read)