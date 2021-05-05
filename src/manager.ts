import {intManager} from "./intManager";
import {Notes} from "./notes";
import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * Class that represents a note manager
 */
export class Manager implements intManager {
    /**
     * Creates a new manager instance
     */
    constructor() {}

    /**
     * Adds a new note to the user's folder
     * @param title Title of the note
     * @param body Body of the note
     * @param color Color of the note
     * @param user User name
     */
    add(title: string, body: string, color: string, user: string): void {
      let note: Notes = new Notes(title, body, color);
      if(fs.existsSync(`./${user}`) == false) fs.mkdirSync(`./${user}`);
      if(fs.existsSync(`./${user}/${title}.json`) == false) {
        fs.writeFileSync(`./${user}/${title}.json`, note.toJSON());
        console.log(chalk.green('Note successfully created!'));
      } else {
        console.log(chalk.red('This note already exists!'));
      }
    }

    /**
     * Removes a note from the user's folder
     * @param user User name
     * @param title Title of the note
     */
    remove(user: string, title: string): void {
      if(fs.existsSync(`./${user}/${title}.json`) == true) {
        fs.rmSync(`./${user}/${title}.json`);
        console.log(chalk.green('Note successfully deleted!'));
      } else {
        console.log(chalk.red('This note doesn\'t exist!'));
      }
    }

    /**
     * Modifies a note from the user's folder
     * @param user User name
     * @param title Title of the note
     * @param newTitle New title for the note
     * @param newBody New body of the note
     * @param newColor New color of the note
     */
    modify(user: string, title: string, newTitle: string, newBody: string, newColor: string): void {
      if(fs.existsSync(`./${user}/${title}.json`) == true) {
        let buffer = fs.readFileSync(`./${user}/${title}.json`);
        let obj = JSON.parse(buffer.toString());
        let note: Notes = new Notes(obj.title, obj.body, obj.color);
        if(newTitle !== '') note.setTitle(newTitle);
        if(newBody !== '') note.setBody(newBody);
        if(newColor !== '') note.setColor(newColor);
        fs.writeFileSync(`./${user}/${title}.json`, note.toJSON());
        console.log(chalk.green('Note successfully modified!'));
      } else {
          console.log(chalk.red('This note doesn\'t exist!'));
      }
    }

    /**
     * List all notes for the specified user
     * @param user User name
     */
    list(user: string): string[] {
      let list: string[] = [];
      console.log(chalk.magenta.underline("\nCurrent filenames:"));
      fs.readdirSync(`./${user}`).forEach((file) => {
          list.push(file);
          let buffer = fs.readFileSync(`./${user}/${file}`);
          let obj = JSON.parse(buffer.toString());
          switch (obj.color) {
            case 'yellow':
              console.log(chalk.yellow(file));
            break;
            case 'red':
              console.log(chalk.red(file));
            break;
            case 'blue':
              console.log(chalk.blue(file));
            break;
            case 'green':
              console.log(chalk.green(file));
            break;
            default:
              console.log(chalk.red('Color not available'));
              break;
          }
      });
      return list;
    }

    /**
     * Reads a specific note if it exists
     * @param user User name
     * @param title Title of the note
     */
    read(user: string, title: string): void {
      if(fs.existsSync(`./${user}/${title}.json`) == true) {
          let buffer = fs.readFileSync(`./${user}/${title}.json`);
          let obj = JSON.parse(buffer.toString());
          switch (obj.color) {
            case 'yellow':
              console.log(chalk.yellow(`${obj.title}\n${obj.body}`));
            break;
            case 'red':
              console.log(chalk.red(`${obj.title}\n${obj.body}`));
            break;
            case 'blue':
              console.log(chalk.blue(`${obj.title}\n${obj.body}`));
            break;
            case 'green':
              console.log(chalk.green(`${obj.title}\n${obj.body}`));
            break;
            default:
              console.log(chalk.red('Color not available'));
              break;
          }
      } else {
          console.log(chalk.red('This note doesn\'t exist!'));
      }
    }
}