# 엔티티

모든 사용자 데이터들은 엔티티 (Entity) 라고 지칭됩니다. 각 엔티티들은 유니크한 데이터값인 UUID 와 엔티티 타입(컬렉션 명의 단수형)을 속성으로 가지게 됩니다. (e.g. "user", "group", "location") baas.io 의 모든 데이터에 접근할때는 이 엔티티의 UUID 값을 이용하여 조회/수정 등을 하게 됩니다.

* [엔티티란?](https://stage.baas.io/docs/ko/devguide/data-model.html#entity)

## 관련 문서

* [엔티티 생성](./entity/create)
* [엔티티 정보 가져오기](./entity/read)
* [엔티티 정보 업데이트](./entity/update)
* [엔티티 삭제](./entity/delete)