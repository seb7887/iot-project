const mqtt = require('mqtt');
const dev = process.env.NODE_ENV !== 'production';
const broker = dev ? 'mqtt://localhost' : '';

const client = mqtt.connect(broker);

// Topics
const mqttTopic = 'device/telemetry';
const configTopic = 'device/config';

let intervalId;

exports.connect = () => {
  client.on('connect', () => {
    client.subscribe(mqttTopic, { qos: 0 });
    client.subscribe(configTopic, { qos: 1 });
    console.log('Virtual Device connected');
  });

  client.on('error', err => {
    console.log(err);
    client.end();
  });

  client.on('close', () => {
    console.log('Virtual Device disconnected');
  });
};

const getInfo = () => {
  return JSON.stringify({
    temperature: Math.floor(Math.random() * 100),
    humidity: Math.floor(Math.random() * 100)
  });
};

const startPublish = interval => {
  intervalId = setInterval(() => {
    const data = getInfo();
    client.publish(mqttTopic, data);
  }, interval);
};

exports.loop = () => {
  let delay = 2000;

  client.on('message', (topic, message) => {
    if (topic === configTopic) {
      console.log(
        `Virtual Device: Delay configuration -> ${message.toString()}`
      );
      clearInterval(intervalId);
      delay = JSON.parse(message.toString()).delay;
      startPublish(delay);
    }
  });

  startPublish(delay);
};
