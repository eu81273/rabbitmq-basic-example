const amqp = require('amqplib');
const sleep = (timeout = 3600000) => new Promise(resolve => setTimeout(resolve, timeout));

void async function () {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Exchange: Exchange 는 프로듀서에게 메시지를 받아서
    // exchange 타입에 의해 정의된 룰에 따라 큐들에게 메시지를 보낸다.
    const exchangeName = 'testExBr';
    await channel.assertExchange(exchangeName, 'fanout', {
        durable: false,
        autoDelete: true,
    });

    // Routing key: 라우팅키는 exchange가 queue들에게 메시지를 라우팅하는 방법을 결정한다.
    // 라우팅키는 일종의 메시지를 위한 주소라고 볼 수 있다.
    // fanout 의 경우 바인딩된 모든 큐에 메시지를 보내므로 라우팅키의 의미가 없다.
    const routingKey = '';

    // Queue: 메시지를 저장하는 버퍼
    // Message: RabbitMQ 통해 프로듀서가 컨슈머에게 보내는 정보
    const queueName = 'testqBr';
    await channel.assertQueue(queueName, {
        exclusive: false, // 독점적인 queue들은 오직 현재 연결에 의해서만 소비될 수 있다. 'exclusive' 를 설정하면 항상 'autoDelete'를 의미한다.
        durable: false, // 브로커 재시작시에도 큐를 살린다. exclusive 와 autoDelete 를 자동 활성화
        autoDelete: true, // 컨슈머가 없으면 자동으로 큐 삭제
        messageTtl: 10000, // 10초 뒤 자동 삭제
        maxLength: 10, // 최신 10개 메시지만 저장가능
    });

    // 메시지를 받기 위해선 하나의 큐는 반드시 적어도 하나 이상의 Exchange 에 바인딩되어야 한다.
    // Binding: 바인딩은 Exchange 와 큐 간의 연결을 의미한다.
    await channel.bindQueue(queueName, exchangeName, routingKey);
    
    await channel.consume(queueName, async function (message) {
        try {
            if (message) {
                console.log(message.content.toString());
                
            }
        } catch (e) {
            console.error(e);
        }
    });
} ()
.catch(console.error);
