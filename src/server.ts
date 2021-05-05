import * as net from 'net';
import {Manager} from "./manager";

let noteManager = new Manager();

net.createServer((connection) => {
    console.log('A client has connected.');

    connection.write(`Connection established.`);

    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        connection.emit('request', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });

    connection.on('request', (message) => {
        switch (message.type) {
            case 'add':
                noteManager.add(message.title, message.body, message.color, message.user);
            break;
            case 'remove':
                noteManager.remove(message.user, message.title);
            break;
            case 'modify':
                noteManager.modify(message.user, message.title, message.newTitle, message.newBody, message.newColor);
            break;
            case 'list':
                noteManager.list(message.user);
            break;
            case 'read':
                noteManager.read(message.user, message.title);
            break;
            default:
            break;
        }
    });

    connection.on('close', () => {
        console.log('A client has disconnected.');
    });
}).listen(60300, () => {
    console.log('Waiting for clients to connect.');
});