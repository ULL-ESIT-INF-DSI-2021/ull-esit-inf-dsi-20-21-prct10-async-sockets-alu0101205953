import "mocha";
import {expect} from "chai";
import * as net from 'net';
import {server} from '../src/server';

const socket = net.connect({port: 60301});
server.listen(60301, () => {
    console.log('Waiting for clients to connect.');
});

describe('Server Tests', () => {
    it('Should emit a message event once it gets a complete message', (done) => {
        server.on('request', (data) => {
            expect(data).to.be.eql({'type': 'change', 'prev': '13', 'curr': '26'});
            server.close();
            done();
        });

        socket.write('{"type": "change", "prev": "13",');
        socket.write('"curr": "26"}');
        socket.write('\n');
        socket.end();
    });
    it('Add note test', (done) => {
        server.on('noteAdded', (data) => {
            expect(data).to.be.equal('Created');
            done();
            server.close();
        });
        socket.write('{\"user\": \"test\", \"type\": \"add\", \"title\": \"test note\", \"body\": \"aaaaaaaaaaaaaa\", \"color\": \"red\"}');
        socket.end();
    });
  });