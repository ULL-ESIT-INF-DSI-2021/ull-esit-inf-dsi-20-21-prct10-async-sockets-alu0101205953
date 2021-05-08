import "mocha";
import {expect} from "chai";
import * as net from 'net';
import {Server} from '../src/server';

describe('Server Tests', () => {
    it('A note can be added if it doesn\'t exist', (done) => {
        let socket = net.connect(60301);
        let server1 = new Server;
        server1.connection(60301);
        server1.on('noteAdded', (data) => {
            expect(data).to.be.equal('Created');
            done();
        });
        socket.write("{\"type\": \"add\", \"title\": \"note1\", \"body\": \"aaaaaa\", \"color\": \"red\", \"user\": \"test\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
    it('A note can\'t be added if it exists', (done) => {
        let socket = net.connect(60302);
        let server1 = new Server;
        server1.connection(60302);
        server1.on('noteNotAdded', (data) => {
            expect(data).to.be.equal('Not created');
            done();
        });
        socket.write("{\"type\": \"add\", \"title\": \"note1\", \"body\": \"aaaaaa\", \"color\": \"red\", \"user\": \"test\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
    it('A note can be modified if it exists', (done) => {
        let socket = net.connect(60303);
        let server1 = new Server;
        server1.connection(60303);
        server1.on('noteModified', (data) => {
            expect(data).to.be.equal('Modified');
            done();
        });
        socket.write("{\"type\": \"modify\", \"user\": \"test\", \"title\": \"note1\", \"newGody\": \"aaaaaaaaa\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
    it('A note can\'t be modified if it doesn\'t exist', (done) => {
        let socket = net.connect(60304);
        let server1 = new Server;
        server1.connection(60304);
        server1.on('noteNotModified', (data) => {
            expect(data).to.be.equal('Not modified');
            done();
        });
        socket.write("{\"type\": \"modify\", \"user\": \"test\", \"title\": \"note2\", \"newGody\": \"aaaaaaaaa\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
    it('A directory can be listed if it exists', (done) => {
        let socket = net.connect(60305);
        let server1 = new Server;
        server1.connection(60305);
        server1.on('dirListed', (data) => {
            expect(data).to.be.equal('Listed');
            done();
        });
        socket.write("{\"type\": \"list\", \"user\": \"test\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
    it('A note can be read if it exists', (done) => {
        let socket = net.connect(60306);
        let server1 = new Server;
        server1.connection(60306);
        server1.on('noteRead', (data) => {
            expect(data).to.be.equal('Read');
            done();
        });
        socket.write("{\"type\": \"read\", \"user\": \"test\", \"title\": \"note1\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
    it('A note can\'t be removed if it doesn\'t exist', (done) => {
        let socket = net.connect(60307);
        let server1 = new Server;
        server1.connection(60307);
        server1.on('noteNotDeleted', (data) => {
            expect(data).to.be.equal('Not deleted');
            done();
        });
        socket.write("{\"type\": \"remove\", \"user\": \"test\", \"title\": \"note2\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
    it('A note can be removed if it exists', (done) => {
        let socket = net.connect(60308);
        let server1 = new Server;
        server1.connection(60308);
        server1.on('noteDeleted', (data) => {
            expect(data).to.be.equal('Deleted');
            done();
        });
        socket.write("{\"type\": \"remove\", \"user\": \"test\", \"title\": \"note1\"}\n");
        socket.on('data', () => {
            server1.server.close();
        });
    });
});