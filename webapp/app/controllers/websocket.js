import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websockets'),

  connect() {
    var ws = this.get('socketService').socketFor('ws://localhost:4201/');

    ws.on('open', () => {
    }, this);

    ws.on('close', () => {
    }, this);

    ws.on('message', (msg, flags) => {
      msg = JSON.parse(msg.data);
      switch (msg.type) {
        case 'alarm':
          this.store.serializerFor('alarm').pushPayload(this.store, msg.data);
          break;
        default:
          console.log('UNKNOWN MESSAGE:', msg);
      }
    }, this);
  }
});
