// AMQP: Advanced Message Queuing Protocol 은 RabbitMQ 에서 메시징을 위해 사용되는 프로토콜이다.
const amqp = require('amqplib');
const sleep = (timeout = 3600000) => new Promise(resolve => setTimeout(resolve, timeout));

// Producer: 메시지를 보내는 앱
void async function () {
    // Connection: 우리가 만든 앱과 RabbitMQ broker 간의 TCP 연결
    const connection = await amqp.connect('amqp://localhost');
    // Channel: Connection 안의 가상 연결. 메시지를 큐를 통해 보내거나 받을 때 모두 채널 상에서 이루어진다.
    const channel = await connection.createChannel();
    // Exchange: Exchange 는 프로듀서에게 메시지를 받아서
    // exchange 타입에 의해 정의된 룰에 따라 큐들에게 메시지를 보낸다.
    // 메시지를 받기 위해선 하나의 큐는 반드시 적어도 하나 이상의 Exchange 에 바인딩되어야 한다.
    // Binding: 바인딩은 Exchange 와 큐 간의 연결을 의미한다.
    const exchangeName = 'my_topic';
    await channel.assertExchange(exchangeName, 'topic', {
        durable: false,
        autoDelete: false,
    });

    for (let i=0; i<10; i++) {
        const data = Buffer.from(JSON.stringify({
            id: i,
            text: i + '번 메시지 입니다'
        }));

        // Routing key: 라우팅키는 exchange가 queue들에게 메시지를 라우팅하는 방법을 결정한다.
        // 라우팅키는 일종의 메시지를 위한 주소라고 볼 수 있다.
        // 라우팅키는 . 으로 구분되고, 각 위치에 반드시 단어가 있어야 한다면 *
        // 없어도 된다면 # 으로 패턴 매칭을 할 수 있다.
        const routingKey = 'my_route.' + i;

        channel.publish(exchangeName, routingKey, data, { persistent: true })
        console.log(i + '번 메시지 발송');
    }

    await sleep(5000);
    await channel.close();
    await connection.close();
} ()
.catch(console.error);
