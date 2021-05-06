import "mocha";
import {expect} from "chai";
import {Manager} from "../src/manager";
import * as fs from 'fs';

let noteManager = new Manager();

describe('Manager tests', () =>{
    it('Se debe poder añadir una nueva nota', () =>{
      noteManager.add("helloworld", "HELLO WORLD!", "blue", "user");
      expect(fs.existsSync("./user/helloworld.json")).to.be.true;
      noteManager.remove("user", "helloworld");
    });
    it('Si la nota ya existe se muestra un mensaje de error', () =>{
      noteManager.add("helloworld", "HELLO WORLD!", "blue", "user");
      expect(noteManager.add("helloworld", "HELLO WORLD2!", "green", "user")).to.be.equal('This note already exists!');
      noteManager.remove("user", "helloworld");
    });
    it('Se debe poder eliminar una nota', () =>{
      noteManager.add("helloworld", "HELLO WORLD!", "blue", "user");
      noteManager.remove("user", "helloworld");
      expect(fs.existsSync("./user/helloworld.json")).to.be.false;
    });
    it('Si la nota no existe se muestra un mensaje de error', () =>{
      expect(noteManager.remove("user", "helloworld")).to.be.equal('This note doesn\'t exist!');
    });
    it('Se debe poder modificar una nota', () =>{
      noteManager.add("helloworld", "HELLO WORLD!", "blue", "user");
      noteManager.modify("user", "helloworld", 'hello-world', 'hello world!', 'yellow');
      expect(fs.existsSync("./user/helloworld.json")).to.be.true;
      let buffer = fs.readFileSync(`./user/helloworld.json`);
      expect(buffer.toString()).to.be.equal('{\n\"title\": \"hello-world\",\n\"body\": \"hello world!\",\n\"color\": \"yellow\"\n}');
      noteManager.remove("user", "helloworld");
    });
    it('Si la nota no existe se muestra un mensaje de error', () =>{
        expect(noteManager.modify("user", "helloworld", '', "HELLO WORLD!", '')).to.be.equal('This note doesn\'t exist!');
      });
    it('Se debe poder leer una nota', () =>{
      noteManager.add("helloworld", "HELLO WORLD!", "blue", "user");
      noteManager.add("helloworld2", "HELLO WORLD!", "yellow", "user");
      noteManager.add("helloworld3", "HELLO WORLD!", "red", "user");
      noteManager.add("helloworld4", "HELLO WORLD!", "green", "user");
      noteManager.add("helloworld5", "HELLO WORLD!", "cyan", "user");
      expect(noteManager.read("user", "helloworld").title).to.be.equal('helloworld');
      expect(noteManager.read("user", "helloworld2").title).to.be.equal('helloworld2');
      expect(noteManager.read("user", "helloworld3").title).to.be.equal('helloworld3');
      expect(noteManager.read("user", "helloworld4").title).to.be.equal('helloworld4');
      expect(noteManager.read("user", "helloworld5").title).to.be.equal('helloworld5');
      expect(noteManager.read("user", "helloworld6").title).to.be.equal('');
      noteManager.remove("user", "helloworld");
      noteManager.remove("user", "helloworld2");
      noteManager.remove("user", "helloworld3");
      noteManager.remove("user", "helloworld4");
      noteManager.remove("user", "helloworld5");
    });
    it('Se deben poder listar las notas correspondientes a un usuario', () =>{
      noteManager.add("helloworld", "HELLO WORLD!", "blue", "user");
      noteManager.add("helloworld2", "HELLO WORLD!", "yellow", "user");
      noteManager.add("helloworld3", "HELLO WORLD!", "red", "user");
      noteManager.add("helloworld4", "HELLO WORLD!", "green", "user");
      noteManager.add("helloworld5", "HELLO WORLD!", "cyan", "user");
      expect(noteManager.list('user')).to.be.eql(["helloworld.json", "helloworld2.json", "helloworld3.json", "helloworld4.json", "helloworld5.json"]);
      noteManager.remove("user", "helloworld");
      noteManager.remove("user", "helloworld2");
      noteManager.remove("user", "helloworld3");
      noteManager.remove("user", "helloworld4");
      noteManager.remove("user", "helloworld5");
      fs.rmdirSync('./user');
    });
  });