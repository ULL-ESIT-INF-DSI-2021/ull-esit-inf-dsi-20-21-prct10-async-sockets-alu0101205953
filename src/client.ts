import * as yargs from 'yargs';
import * as chalk from 'chalk';
import * as net from 'net';

const client = net.connect({port: 60300});

/** The request type. It contains the type of operation, and some additional parameters such as user, title of the note, etc. that are usefull dependin on the operation we want to do */
export type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list';
    user?: string;
    title?: string;
    body?: string;
    color?: string;
    newTitle?: string;
    newBody?: string;
    newColor?: string;
}

/** Command that allows to add a note */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User Name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
      },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string' && typeof argv.user === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'add',
            title: argv.title,
            body: argv.body,
            color: argv.color,
        };
        client.write(JSON.stringify(request) + '\n');
        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });
        client.on('end', () => {
          const message = JSON.parse(wholeData);
          if(message.success) {
            console.log(chalk.green("Note created successfully"));
          } else {
            console.log(chalk.red("This note already exists"));
          }
          client.emit('complete', wholeData);
        });
    } else {
      console.log(chalk.bgRed("Argument missing"));
    }
  },
});

/** Command that allows to remove a note */
yargs.command({
  command: 'remove',
  describe: 'Delete a note',
  builder: {
    user: {
      describe: 'User Name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'remove',
            title: argv.title,
        };
        client.write(JSON.stringify(request) + '\n');
        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });
        client.on('end', () => {
          const message = JSON.parse(wholeData);
          if(message.success) {
            console.log(chalk.green("Note deleted successfully"));
          } else {
            console.log(chalk.red('This note doesn\'t exist!'));
          }
          client.emit('complete', wholeData);
        });
    } else {
      console.log(chalk.bgRed("Argument missing"));
    }
  },
});

/** Command that allows to modify a note */
yargs.command({
  command: 'modify',
  describe: 'Modify a note',
  builder: {
    user: {
      describe: 'User Name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    newTitle: {
      describe: 'New title',
      demandOption: false,
      type: 'string',
    },
    newBody: {
      describe: 'New body',
      demandOption: false,
      type: 'string',
    },
    newColor: {
      describe: 'New color',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
      if(typeof argv.newTitle === 'string' && typeof argv.newBody === 'string' && typeof argv.newColor === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'modify',
            title: argv.title,
            newTitle: argv.newTitle,
            newBody: argv.newBody,
            newColor: argv.newColor,
        };
        client.write(JSON.stringify(request) + '\n');
      } else if(typeof argv.newTitle === 'undefined' && typeof argv.newBody === 'string' && typeof argv.newColor === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'modify',
            title: argv.title,
            newTitle: '',
            newBody: argv.newBody,
            newColor: argv.newColor,
        };
        client.write(JSON.stringify(request) + '\n');
      } else if(typeof argv.newTitle === 'undefined' && typeof argv.newBody === 'undefined' && typeof argv.newColor === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'modify',
            title: argv.title,
            newTitle: '',
            newBody: '',
            newColor: argv.newColor,
        };
        client.write(JSON.stringify(request) + '\n');
      } else if(typeof argv.newTitle === 'undefined' && typeof argv.newBody === 'string' && typeof argv.newColor === 'undefined') {
        let request: RequestType = {
            user: argv.user,
            type: 'modify',
            title: argv.title,
            newTitle: '',
            newBody: argv.newBody,
            newColor: '',
        };
        client.write(JSON.stringify(request) + '\n');
      } else if(typeof argv.newTitle === 'string' && typeof argv.newBody === 'undefined' && typeof argv.newColor === 'undefined') {
        let request: RequestType = {
            user: argv.user,
            type: 'modify',
            title: argv.title,
            newTitle: argv.newTitle,
            newBody: '',
            newColor: '',
        };
        client.write(JSON.stringify(request) + '\n');
      } else if(typeof argv.newTitle === 'string' && typeof argv.newBody === 'undefined' && typeof argv.newColor === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'modify',
            title: argv.title,
            newTitle: argv.newTitle,
            newBody: '',
            newColor: argv.newColor,
        };
        client.write(JSON.stringify(request) + '\n');
      } else if(typeof argv.newTitle === 'string' && typeof argv.newBody === 'string' && typeof argv.newColor === 'undefined') {
        let request: RequestType = {
            user: argv.user,
            type: 'modify',
            title: argv.title,
            newTitle: argv.newTitle,
            newBody: argv.newBody,
            newColor: '',
        };
        client.write(JSON.stringify(request) + '\n');
      } else {
        console.log(chalk.bgRed("Not changing anything..."));
      }

        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });
        client.on('end', () => {
          const message = JSON.parse(wholeData);
          if(message.success) {
            console.log(chalk.green("Note modified successfully"));
          } else {
            console.log(chalk.red('This note doesn\'t exist!'));
          }
          client.emit('complete', wholeData);
        });
    } else {
      console.log(chalk.bgRed("Argument missing"));
    }
  },
});

/** Command that allows the content of a specified user's directory */
yargs.command({
  command: 'list',
  describe: 'List every note title',
  builder: {
    user: {
      describe: 'User Name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'list',
        };
        client.write(JSON.stringify(request) + '\n');
        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });
        client.on('end', () => {
          const message = JSON.parse(wholeData);
          console.log(chalk.magenta.underline("\nCurrent filenames:"));
          console.log(message.list.toString(', '));
          client.emit('complete', wholeData);
        });
    } else {
      console.log(chalk.bgRed("Argument missing"));
    }
  },
});

/** Command that allows to read a specified note */
yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    user: {
      describe: 'User Name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
        let request: RequestType = {
            user: argv.user,
            type: 'read',
            title: argv.title,
        };
        client.write(JSON.stringify(request) + '\n');
        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });
        client.on('end', () => {
          const message = JSON.parse(wholeData);
          if(message.success) {
            let dummy = JSON.parse(message.notes);
            switch (dummy.color) {
              case 'red':
                console.log(chalk.red(dummy.title + '\n' + dummy.body));
              break;
              case 'blue':
                console.log(chalk.blue(dummy.title + '\n' + dummy.body));
              break;
              case 'green':
                console.log(chalk.green(dummy.title + '\n' + dummy.body));
              break;
              case 'yellow':
                console.log(chalk.yellow(dummy.title + '\n' + dummy.body));
              break;
              default:
                break;
            }
          } else {
            console.log(chalk.red('This note doesn\'t exist!'));
          }
          client.emit('complete', wholeData);
        });
    } else {
      console.log(chalk.bgRed("Argument missing"));
    }
  },
});

yargs.parse();