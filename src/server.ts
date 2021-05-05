import * as net from 'net';
import {Manager} from "./manager";
import {Notes} from "./notes";

let noteManager = new Manager();

export type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list';
    success: boolean;
    notes?: Notes;
    list?: string[];
  }

export let server = net.createServer((connection) => {
    console.log('A client has connected.');

    // connection.write(`Connection established.\n`);

    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        connection.emit('request', JSON.parse(message));
        server.emit('request', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });

    connection.on('request', (message) => {
        switch (message.type) {
            case 'add':
                if(noteManager.add(message.title, message.body, message.color, message.user).includes('successfully')) {
                    let response: ResponseType = {
                        type: 'add',
                        success: true,
                    };
                    connection.write(JSON.stringify(response) + '\n');
                    connection.end();
                } else {
                    let response: ResponseType = {
                        type: 'add',
                        success: false,
                    };
                    connection.write(JSON.stringify(response) + '\n');
                    connection.end();
                }
            break;
            case 'remove':
                if(noteManager.remove(message.user, message.title).includes('successfully')) {
                    let response: ResponseType = {
                        type: 'remove',
                        success: true,
                    };
                    connection.write(JSON.stringify(response) + '\n');
                    connection.end();
                } else {
                    let response: ResponseType = {
                        type: 'remove',
                        success: false,
                    };
                    connection.write(JSON.stringify(response) + '\n');
                    connection.end();
                }
            break;
            case 'modify':
                if(noteManager.modify(message.user, message.title, message.newTitle, message.newBody, message.newColor).includes('successfully')) {
                    let response: ResponseType = {
                        type: 'modify',
                        success: true,
                    };
                    connection.write(JSON.stringify(response) + '\n');
                    connection.end();
                } else {
                    let response: ResponseType = {
                        type: 'modify',
                        success: false,
                    };
                    connection.write(JSON.stringify(response) + '\n');
                    connection.end();
                }
            break;
            case 'list':
                let response: ResponseType = {
                    type: 'list',
                    success: true,
                    list: noteManager.list(message.user),
                };
                connection.write(JSON.stringify(response) + '\n');
                connection.end();
            break;
            case 'read':
                let response2 = {
                    type: 'read',
                    success: true,
                    notes: noteManager.read(message.user, message.title),
                };
                connection.write(JSON.stringify(response2) + '\n');
                connection.end();
            break;
            default:
            break;
        }
    });

    connection.on('close', () => {
        console.log('A client has disconnected.');
    });
});

/* server.listen(60300, () => {
    console.log('Waiting for clients to connect.');
}); */