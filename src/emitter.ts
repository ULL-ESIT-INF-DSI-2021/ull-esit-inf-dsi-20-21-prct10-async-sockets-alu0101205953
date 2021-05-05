import {EventEmitter} from 'events';

export class MessageEventEmitterClient extends EventEmitter {
  constructor(public connection: any) {
    super();

    let wholeData = '';
    connection.on('data', (dataChunk: any) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}