'use strict';

var MQTT = require('mqtt'),
    config = require('../config'),
    mqtt = MQTT.connect('mqtt://' + config.mqttHost, {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      username: config.mqttUser,
      password: new Buffer(config.mqttPw)
    });

var id = 202;

function send() {
  mqtt.publish('/alarm', JSON.stringify({ alarm: { id: ++id, time: Date.now() } }));
}
mqtt.on('connect', function () {
  console.log('MQTT CONNECT');
  mqtt.subscribe('/event');
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

var events = [];

mqtt.on('message', function (topic, message) {
  if (topic != '/event') return;
  events.push(JSON.parse(message.toString()).event);
  var now = Date.now();
  events = events.filter(function (ev) {
    return now - ev.time < 5000;
  });
  console.log('events: ', events.map(function (ev) { return now - ev.time; }));
  if (events.length >= 5) {
    console.log('time since first:', now - events[0].time);
    mqtt.publish('/alarm', JSON.stringify({ alarm: { id: ++id, time: now } }));
    events = [];
  }
});
