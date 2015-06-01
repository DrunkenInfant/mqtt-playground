'use strict';

var MQTT = require('mqtt'),
    config = require('../config'),
    mqtt = MQTT.connect('mqtt://' + config.mqttHost, {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      username: config.mqttUser,
      password: new Buffer(config.mqttPw)
    });

var id = 1;

function send() {
  mqtt.publish('/event', JSON.stringify({ event: { id: ++id, time: Date.now() } }));
  var timeout = Math.floor(Math.random() * 1000) + 600;
  console.log(timeout);
  setTimeout(send, timeout);
}
mqtt.on('connect', function () {
  console.log('MQTT CONNECT');
  send();
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
