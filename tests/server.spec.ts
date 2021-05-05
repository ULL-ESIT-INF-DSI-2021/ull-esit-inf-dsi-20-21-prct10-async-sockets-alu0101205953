import "mocha";
import {expect} from "chai";
import * as net from 'net';
import {server} from '../src/server';

describe('Server Tests', () => {
    it('Should emit a message event once it gets a complete message', (done) => {
        const socket = net.connect({port: 60300});
        server.on('request', (data) => {
            expect(data).to.be.eql({'type': 'change', 'prev': '13', 'curr': '26'});
            done();
        });

        socket.write('{"type": "change", "prev": "13",');
        socket.write('"curr": "26"}');
        socket.write('\n');
    });
  });