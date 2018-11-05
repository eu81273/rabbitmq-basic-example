# RabbitMQ Test
예제로 알아보는 RabbitMQ.

### RabbitMQ 설치
```
# rabbitmq 도커 기반 설치
# http://localhost:15672 (guesst/guest)
$ docker run -d --hostname my-rabbit --name some-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:management-alpine

```

### 예제 코드 실행
```
# 메시지 프로듀서 실행
$ node producer.js

# 메시지 컨슈머 실행
$ node consumer.js
```

### 참고 사이트
https://www.cloudamqp.com/blog/2015-05-18-part1-rabbitmq-for-beginners-what-is-rabbitmq.html
https://www.cloudamqp.com/blog/part2-rabbitmq-for-beginners_example-and-sample-code.html
https://www.cloudamqp.com/blog/2015-05-27-part3-rabbitmq-for-beginners_the-management-interface.html
https://www.cloudamqp.com/blog/2015-09-03-part4-rabbitmq-for-beginners-exchanges-routing-keys-bindings.html
