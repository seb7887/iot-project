const chalk = require('chalk');
const mosca = require('mosca');

const settings = {
  port: 1883
};

const server = new mosca.Server(settings);

server.on('ready', () => {
  console.log(chalk.default.bgGreen.black('MQTT Broker ready'));
});

server.on('clientConnected', client => {
  console.log(
    chalk.default.bgGreen.black(`MQTT Broker: Client connected ${client.id}`)
  );
});

server.on('published', (packet, client) => {
  console.log(chalk.default.bgGreen.black(`Topic: ${packet.topic}`));
  console.log(
    chalk.default.bgGreen.black(
      `Published: ${packet.payload.toString('utf-8')}`
    )
  );
});

// server.authenticate = function(
//   client: Client,
//   username: string,
//   password: string,
//   callback: any
// ) {
//   const authorized = username === 'seb' && password.toString() === 'secret';
//   callback(null, authorized);
// };
