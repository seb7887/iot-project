import * as mqtt from 'mqtt';

const dev = process.env.NODE_ENV !== 'production';
const broker = dev ? 'mqtt://localhost' : '';

const mqttTopic = 'device/telemetry';

module.exports = async () => {
  const client = mqtt.connect(broker);

  client.on('connect', () => {
    client.subscribe(mqttTopic, { qos: 0 });
    console.log('Lambda Function connected');
  });

  client.on('close', () => {
    console.log('Lambda Function disconnected');
  });

  client.on('error', err => {
    console.log(err);
    client.end();
  });

  client.on('message', (topic: string, message: any) => {
    if (topic === mqttTopic) {
      console.log('Message ' + message.toString());
    }
  });
};
