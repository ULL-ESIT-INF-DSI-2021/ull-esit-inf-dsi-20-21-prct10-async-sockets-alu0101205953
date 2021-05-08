import "mocha";
import {expect} from "chai";
import * as net from 'net';
import {server} from '../src/server';
import {EventEmitter} from "events";
import {emit} from "process";

server.listen(60301, () => {
    console.log('Waiting for clients to connect.');
});
// const socket = net.connect({port: 60301});
let emitter = new EventEmitter();
emitter.emit('test1', '');

describe('Server Tests', () => {
    /* it('Should emit a message event once it gets a complete message', (done) => {
        server.on('request', (data) => {
            expect(data).not.to.be.undefined;
            done();
        });
    });*/
    it('Can add a note if it doesn\'t exist', (done) => {
        server.on('noteAdded', (data) => {
            expect(data).to.be.equal('Created');
            // server.close();
            emitter.emit('test2', '');
            done();
        });
        emitter.on('test1', () => {
            const socket = net.connect({port: 60301});
            console.log('huuulaaa');
            socket.write('{\"user\": \"test\", \"type\": \"add\", \"title\": \"test note\", \"body\": \"aaaaaaaaaaaaaa\", \"color\": \"red\"}\n');
        });
        // socket.end();
    });
    it('Can\'t add a note if it exists', (done) => {
        server.on('noteNotAdded', (data) => {
            expect(data).to.be.equal('Not created');
            // server.close();
            emitter.emit('close', '');
            done();
        });
        emitter.on('test2', () => {
            const socket = net.connect({port: 60301});
            socket.write('{\"user\": \"test\", \"type\": \"add\", \"title\": \"test note\", \"body\": \"aaaaaaaaaaaaaa\", \"color\": \"red\"}\n');
        });
        emitter.on('close', () => {
            server.close();
        });
        // socket.end();
    });
    /* it('Can delete a note if it exists', (done) => {
        server.on('noteDeleted', (data) => {
            expect(data).to.be.equal('Deleted');
            // server.close();
            done();
        });

        socket.write('{\"user\": \"test\", \"type\": \"remove\", \"title\": \"test note\"}\n');
        // socket.end();
    });
    it('Can\'t delete a note if it doesn\'t exist', (done) => {
        server.on('noteNotDeleted', (data) => {
            expect(data).to.be.equal('Not deleted');
            server.close();
            done();
        });
        socket.write('{\"user\": \"test\", \"type\": \"remove\", \"title\": \"test note\"}\n');
        socket.end();
    }); */
  });