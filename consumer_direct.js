const amqp = require('amqplib');

// consumer: 메시지를 소비하는 앱
void async function () {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Exchange: Exchange 는 프로듀서에게 메시지를 받아서
    // exchange 타입에 의해 정의된 룰에 따라 큐들에게 메시지를 보낸다.
    const exchangeName = 'my_direct';
    await channel.assertExchange(exchangeName, 'direct', {
        durable: false,
        autoDelete: false,
    });

    // Routing key: 라우팅키는 exchange가 queue들에게 메시지를 라우팅하는 방법을 결정한다.
    // 라우팅키는 일종의 메시지를 위한 주소라고 볼 수 있다.
    const routingKey = 'my_direct_route';

    // Queue: 메시지를 저장하는 버퍼
    // Message: RabbitMQ 통해 프로듀서가 컨슈머에게 보내는 정보
    const queueName = 'my_direct_queue';
    await channel.assertQueue(queueName, {
        exclusive: false, // 독점적인 queue들은 오직 현재 연결에 의해서만 소비될 수 있다. 'exclusive' 를 설정하면 항상 'autoDelete'를 의미한다.
        durable: false, // 브로커 재시작시에도 큐를 살린다. exclusive 와 autoDelete 를 자동 활성화
        autoDelete: false, // 컨슈머가 없으면 자동으로 큐 삭제
    });

    // 메시지를 받기 위해선 하나의 큐는 반드시 적어도 하나 이상의 Exchange 에 바인딩되어야 한다.
    // Binding: 바인딩은 Exchange 와 큐 간의 연결을 의미한다.
    await channel.bindQueue(queueName, exchangeName, routingKey);

    await channel.consume(queueName, async function (message) {
        try {
            if (message) {
                console.log(message.content.toString());
                channel.ackAll();
            }
        } catch (e) {
            console.error(e);
        }
    });
} ()
.catch(console.error);
