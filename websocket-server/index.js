'use strict';

var WSServer = require('ws').Server,
    wss = new WSServer({ port: 4201 }),
    MQTT = require('mqtt'),
    config = require('../config'),
    mqtt = MQTT.connect('mqtt://' + config.mqttHost, {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      username: config.mqttUser,
      password: new Buffer(config.mqttPw)
    });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

mqtt.on('connect', function () {
  console.log('MQTT CONNECT');
  mqtt.subscribe('/alarm');
});

mqtt.on('close', function () {
  console.log('MQTT close:');
});

mqtt.on('reconnect', function () {
  console.log('MQTT reconnect:');
});

mqtt.on('error', function (error) {
  console.log('MQTT ERROR:', error);
});

mqtt.on('message', function (topic, message) {
  console.log('MQTT:', topic, JSON.parse(message.toString()));
  wss.broadcast(JSON.stringify({ type: 'alarm', data: JSON.parse(message.toString()) }));
});

var id = 101;

function periodicBroadcast() {
  wss.broadcast(JSON.stringify({ type: 'alarm', data: { alarm: { id: ++id, time: Date.now() } } }));
  setTimeout(periodicBroadcast, 5000);
};

//setTimeout(periodicBroadcast, 5000);
