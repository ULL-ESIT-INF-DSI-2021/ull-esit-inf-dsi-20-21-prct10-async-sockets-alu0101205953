import "mocha";
import {expect} from "chai";
import {Notes} from "../src/notes";

let newNote = new Notes("hello", "Hello world!", "green");

describe('Note tests', () =>{
    it('Se debe poder obtener la información de una nota', () =>{
      expect(newNote.getTitle()).to.be.equal("hello");
      expect(newNote.getBody()).to.be.equal("Hello world!");
      expect(newNote.getColor()).to.be.equal("green");
    });
    it('Se debe poder cambiar la información de una nota', () =>{
        newNote.setTitle("hi!");
        expect(newNote.getTitle()).to.be.equal("hi!");
        newNote.setBody("Hi world!");
        expect(newNote.getBody()).to.be.equal("Hi world!");
        newNote.setColor("yellow");
        expect(newNote.getColor()).to.be.equal("yellow");
    });
    it('Se debe poder obtener la cadena con información de la nota en formato JSON', () =>{
        expect(newNote.toJSON()).to.be.equal('{\n\"title\": \"' + newNote.title + '\",\n\"body\": \"' + newNote.body + '\",\n\"color\": \"' + newNote.color + '\"\n}');
    });
  });