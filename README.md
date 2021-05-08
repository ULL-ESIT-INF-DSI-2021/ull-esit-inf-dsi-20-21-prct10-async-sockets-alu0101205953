[![Tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953/actions/workflows/tests.yml)
[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953/actions/workflows/coveralls.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953&metric=alert_status)](https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101205953?branch=master)

## Desarrollo de Sistemas Informáticos. Universidad de la Laguna

***
# Práctica 10: Implementación de un cliente y un servidor de la aplicación de procesamiento de notas mediante Sockets en Node.js

## **Índice de contenidos:**

* Introducción
* Objetivos
* Tareas previas
* Desarrollo
* Gestión de línea de comandos
* Pruebas
* Documentación
* GitHub Actions
    * Tests
    * Coveralls
    * SonarCloud
* Problemas e incidencias encontrados

### **Introducción**

En esta práctica aprenderemos a utilizar la línea de comandos y el sistema de ficheros gracias a la creación de un gestor de notas

### **Objetivos**

El objetivo de esta práctica es aprender a crear una aplicación cliente-servidor que permita gestionar notas utilizando el sistema de ficheros y sockets, además de desplegar documentación del código con la herramienta Typedoc y testear las funciones haciendo uso de la metodología [TDD/BDD](https://www.paradigmadigital.com/techbiz/tdd-una-metodologia-gobernarlos-todos/#:~:text=TDD%20son%20las%20siglas%20de,c%C3%B3digo%20que%20tenemos%20que%20implementar.) y las herramientas mocha y chai. Por último configuraremos las herramientas Yargs, que permitirá gestionar la línea de comandos, y Chalk, para añadir color a la salida por pantalla.

### **Tareas previas**

Antes de comenzar ha sido necesario consultar los apuntes de la asignatura en el apartado de sockets, la documentación del [módulo net](https://nodejs.org/dist/latest-v16.x/docs/api/net.html) y del [módulo Events](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter).

### **Desarrollo** 

![sticky_notes](https://i2.wp.com/www.techforpc.com/wp-content/uploads/2017/02/sticky-notes-pc-mac-windows-7810-free-download.png?fit=512,512&ssl=1)

Para el desarrollo de esta práctica se ha dividido el código en dos clases, ajustándose al principio SOLID de responsabilidad única, donde cada una de ellas implementa una interfaz que le proporciona su funcionalidad.

#### **Clase Notas**

Esta clase contiene los atributos que debe tener una nota, que son: Título, cuerpo y color.
Por cada uno de estos atributos se ha creado un getter para obtener el atributo desde fuera de la clase, y un setter para asignarle un valor a cada uno de ellos. Además, esta clase implementa un método denominado _toJSON_, que permite obtener una cadena en formato JSON a partir de los atributos de un objeto de la clase.

~~~typescript
toJSON(): string {
        return '{\n\"title\": \"' + this.title + '\",\n\"body\": \"' + this.body + '\",\n\"color\": \"' + this.color + '\"\n}';
    }
~~~

#### **Clase Manager**

Esta clase es la que permite gestionar las notas mediante los siguientes métodos:

* **add(título, cuerpo, color, usuario)**: Este método permite añadir una nueva nota al directorio con nombre igual al nombre de usuario en caso de que no exista una nota ya creada con el mismo título, comprobando previamente que el directorio existe, y en caso contrario crearlo usando la función _fs.mkdirSync_. Esta comprobación se realiza gracias a la función _fs.existsSync_ de la API síncrona de Node.js. En caso de que la nota en cuestión no exista, se crea un nuevo objeto nota con los atributos que se pasan a la función (aquellos que especifica el usuario por línea de comandos) y se convierten a una cadena en formato JSON para así plasmarlos en un fichero gracias a la función _fs.writeFileSync_.

* **remove(usuario, título)**: Esta función comprueba que existe una nota con el título especificado y la elimina usando la función _fs.rmSync_.

* **modify(usuario, título, nuevoTítulo, nuevoCuerpo, nuevoColor)**: Esta función permite modificar alguno de los campos de la nota. Los campos que no se especifiquen por lía de comandos se sobreentenderá que están en blanco, por tanto no sufrirán modificaciones. Para ello en primer lugar comprobamos que existe una nota con el título especificado, y en caso afirmativo, creamos una variable de tipo buffer, donde se almacena el contenido leído de la nota con la función _fs.readFileSync_. A partir de ese buffer se crea un objeto JavaScript con la función _JSON.parse_, y con ello podemos crear un nuevo objeto nota. A continuación comprobamos cuáles de los atributos de la nota pretende modificar el usuario, y se cambian empleando los métodos setter de la clase Notas. Por último, del mismo modo que en la función add, escribimos la nota en el fichero con _fs.writeFileSync_.

* **list(usuario)**: Este método permite listar los títulos de las notas que posee un usuario especificado en el color correspondiente a cada una de ellas. Empleando la función _fs.readdirSync_ podemos listar los títulos de las notas que se encuentran en el directorio del usuario. Usando un bucle forEach y una variable de tipo buffer, donde se almacena el contenido leído de la nota con la función _fs.readFileSync_ utilizamos del mismo modo que anteriormente un objeto JavaScript para obtener el color que posee cada nota. Con una estructura switch-case que evalúe el color de la nota y el módulo chalk, podemos imprimir por consola el título en el color correspondiente. De cara a implementar las pruebas del método, se devuelve una lista  con los títulos de cada nota.

* **read(usuario, título)**: Esta función permite leer el título así como el contenido de una nota comprobando previamente que la misma existe en el directorio del usuario. Del mismo modo que en la función anterior, utilizamos un objeto y una estructura switch-case que permite imprimir el título y el contenido de la nota en el color obtenido de la mismo con el módulo chalk.

#### **Servidor**

El servidor consta de una clase cuyo atributo principal es un objeto servidor. En el constructor se define en primer lugar la conexión del mismo. A continuación se define un evento tal que recoja el mensaje en caso de que sea recibido por partes y lo unifique. 
Para gestionar la peticiones de los clientes, el servidor gestiona el evento _request_. En función del tipo de mensaje que reciba, ejecutará una acción del gestor de notas u otra, y elaborará una respuesta que contendrá un tipo en función de la operación realizada, una variable que indica si la operación se ha realizado o no, y, en el caso del comando list, una lista de elementos, o en caso del comando read, una nota. A continuación envía una respuesta serializada al cliente y emite un evento de cierre de conexión.
Por último, el método `connection` permite poner el servidor en escucha en el puerto indicado. 

#### **Cliente**

Para gestionar las peticiones al servidor se realizan mediante la gestión de los comandos introducidos por el usuario. Una vez recibido el comando se genera una respuesta con los parámetros introducidos y el tipo de petición que queremos realizar, y esta se serializa mediante _JSON.stringify()_. Además, igual que anteriormente debemos tener en cuenta que el mensaje puede ser enviado en fragmentos, y estos deben ser unidos. Para ello se gestiona el evento _data_ de la misma manera que en el servidor. Cuando el cliente recibe la respuesta del servidor, y este ha cerrado la conexión, debe parsear la respuesta recibida para comprobar si la operación solicitada se ha realizado exitosamente. Por último, emite un evento que indica que se ha completado la operación y cierra la conexión.

### **Gestión de línea de comandos**

Gracias al módulo yargs podemos gestionar los comandos que el usuario va a introducir al ejecutar el código desde la terminal. Un comando se define la siguiente manera:

~~~typescript
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
      noteManager.add(argv.title, argv.body, argv.color, argv.user);
    } else {
      console.log(chalk.bgRed("Argument missing"));
    }
  },
});
~~~

En primer lugar, un comando tiene un nombre y una descripción. En el apartado builder se especifican los argumentos que se pueden introducir, su nombre, si es o no obligatorio y el tipo del mismo. Por último se define un handler, es decir, la lógica que se va a emplear cuando se ejecuta el comando en cuestión. Por ejemplo, en este caso para poder añadir una nueva nota se comprueba que todos los argumentos son de tipo string, es decir, se han especificado todos ellos, y entonces invocamos el método add del gestor de notas con los parámetros introducidos. En caso de que algún comando no haya sido especificado se mostrará un mensaje por pantalla en color rojo. Cada uno de los métodos del gestor de notas se corresponde con un comando implementado en el fichero _index.ts_.

### **Pruebas**

Como bien indica la metodología TDD, la forma correcta de realizar las pruebas ajustándose a dicha metodología es escribiéndolas en primera instancia y a continuación escribiendo la mínima porción de código que permite pasar la prueba en cuestión.

Para ello, en primer lugar debemos importar los módulos `mocha` y expect, perteneciente a `chai`, además de las funciones que vamos a utilizar en las pruebas desde el fichero correspondiente. 

~~~
import 'mocha';
import {expect} from 'chai';
~~~

Para escribir las pruebas, en primer lugar escribimos una descripción del bloque de pruebas en general. A continuación, escribimos una descripción de la prueba en cuestión, seguida de una función anónima, donde haremos una llamada a la función que queremos probar, precedida de la palabra reservada `expect`. Esta llamada va seguida de las palabras reservadas to y be, y añadimos la palabra equal, ya que queremos asegurar que el resultado de la función es igual al que especificamos en la función equal. También utilizamos la palabra reservada undefined, cuando la función no devuelve un resultado.
Por ejemplo, las pruebas de la clase notas son las siguientes: 

~~~typescript
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
~~~

Todas estas pruebas deberán estar alojadas en el directorio tests. Además, para ejecutarlas más fácilmente se ha modificado el fichero package.json, y se ha añadido en el apartado de scripts lo siguiente:

~~~
"test": "mocha"
~~~

De esta forma podemos ejecutar las pruebas con el comando `npm run test`.

### **Documentación**

Para documentar el código de cada función, se deberá hacer uso de las etiquetas disponibles en [este enlace](https://typedoc.org/guides/doccomments/#supported-tags). Todo el texto se deberá englobar entre los símbolos /** */. Una gran ventaja del IDE Visual Studio Code es que al escribir los primeros caracteres para añadir comentarios, detecta automáticamente que se pretende incluir documentación, y al presionar enter, crea la estructura con las etiquetas correspondientes, donde sólo deberemos completar los espacios donde se corresponde con la descripción de los atributos y de la función.

![Autofill de comentario](https://i.imgur.com/GvWlIdQ.png)

Ejemplo de documentación de la clase notas:

~~~typescript
/**
 * Class that represents a note
 */
export class Notes implements intNotes {
    /**
     * Creates a new note instance
     * @param title Title of the note
     * @param body Body of the note
     * @param color Color of the note
     */
    constructor(public title: string, public body: string, public color: string) {}

    /**
     * Obtains the note title
     * @returns Title of the note
     */
    getTitle() {
        return this.title;
    }

    /**
     * Obtains the note body
     * @returns Body of the note
     */
    getBody() {
        return this.body;
    }

    /**
     * Obtains the note color
     * @returns Color of the note
     */
    getColor() {
        return this.color;
    }

    /**
     * Sets a new title to an existing note
     */
    setTitle(newTitle: string) {
        this.title = newTitle;
    }

    /**
     * Sets a new body to an existing note
     */
    setBody(newBody: string) {
        this.body = newBody;
    }

    /**
     * Sets a new color to an existing note
     */
    setColor(newColor: string) {
        this.color = newColor;
    }

    /**
     * Converts a note attributes into a JSON formatted string
     * @returns A JSON formatted string
     */
    toJSON(): string {
        return '{\n\"title\": \"' + this.title + '\",\n\"body\": \"' + this.body + '\",\n\"color\": \"' + this.color + '\"\n}';
    }
}
~~~

Para poder generar la documentación, como anteriormente se ha creado un fichero typedoc.json en el que se anota el nombre de todos los ficheros de los que se quiere desplegar la documentación y se ha añadido al apartado de scripts del fichero package.json esta línea:

~~~
"doc": "typedoc"
~~~

Ahora se puede generar la documentación a partir del comando `npm run doc`. Se generará un documento html que contiene una página con la documentación de las funciones que hemos escrito.

### **GitHub Actions**

La integración continua consiste en que con cada cambio que se realiza en el código fuente (push a un repositorio o pull request) se tratan de ejecutar los tests para comprobar si los últimos cambios afectan a los tests. Se crean a partir de plantilla que utilizan node.js como entorno de ejecución. Para utilizar esta herramienta deberemos instalar el paquete de typescript como dependencia de nuestro proyecto y en el apartado de _Actions_ de GitHub instalaremos el paquete de integración continua para node.js.
A continuación procedemos a crear un flujo de trabajo. Un flujo de trabajo tiene un nombre descriptivo. Con cada push o pull request  se llevan a cabo una serie de acciones, las versiones de node en las que se va a ejecutar y los pasos a seguir. Generalmente se utiliza el comando npm ci, que es similar a npm install pero más adecuado a entorno de integración continua, aunque en este caso al no estar conservando el fichero _package-lock.json_ no podremos hacer uso de este comando, por tanto emplearemos _npm install_.

Se nos generará un fichero, que debe contener la siguiente información:

~~~
name: Tests

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js 15.x
      uses: actions/setup-node@v2
      with:
        node-version: 15.x
    - run: npm install
    - run: npm test
~~~

Esta información indica que se ejecutará el flujo de trabajo por cada push o pull request a la rama master, se probará únicamente en la versión 15.x de node puesto que las anteriores ya que alguna de las funciones que se emplean para gestionar el sistema de ficheros no tienen soporte en versiones anteriores, y se ejecutarán los comandos _npm install_ para gestionar las dependencias y _npm test_ para ejecutar las pruebas del proyecto.

A continuación creamos un nuevo flujo de trabajo para enviar un informe de cubrimiento a Coveralls. 
En primer lugar modificamos el script _coverage_, y lo sustituimos por la siguiente línea:

~~~
"coverage": "nyc npm test && nyc report --reporter=lcov"
~~~

En el directorio _.github/workflows_ creamos un nuevo fichero que contendrá la siguiente información:

~~~
name: Coveralls

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  coveralls:

    runs-on: ubuntu-latest

    steps:
    - name: Cloning repo
      uses: actions/checkout@v2
    - name: Use Node.js 15.x
      uses: actions/setup-node@v2
      with:
        node-version: 15.x
    - name: Installing dependencies
      run: npm install
    - name: Generating coverage information
      run: npm run coverage
    - name: Coveralls Github Action
      uses: coverallsapp/github-action@master
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
~~~

De nuevo esto hará ejecutarse el flujo de trabajo con cada push o pull request, pero esta vez usando la versión 15 de node.js. Los pasos a seguir consisten en:
* Instalar dependencias
* Generar información de cubrimiento haciendo uso del script _coverage_
* Enviar la información de cubrimiento a Coveralls

De esta manera una vez que hagamos público el repositorio podremos consultar la información en la web de [Coveralls](https://coveralls.io/)

Por último, crearemos un flujo de trabajo para SonarCloud. SonarCloud es una herramienta que muestra las estadísticas del código que está evaluando, bugs, líneas duplicadas, etc. Para ello, accedemos a la web de [SonarCloud](sonarcloud.io) y con el repositorio con visibilidad pública deshabilitamos la opción de análisis automático y optamos por configurar la GitHub Action siguiendo el tutorial que se indica. Para ello debemos crear dos ficheros, el primero en el directorio donde se encuentran las demás acciones, que contiene la siguiente información:

~~~
name: Sonar-Cloud

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
      
jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - name: Cloning Repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0  # Shallow clones should be disabled for a better relevancy of analysis
      - name: Uses Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 15.x
      - name: Installing dependencies
        run: npm install
      - name: Generating coverage report
        run: npm run coverage
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
~~~

Y el segundo en el directorio raíz del proyecto, que contiene lo siguiente:

~~~
sonar.projectKey=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101205953
sonar.organization=ull-esit-inf-dsi-2021

# This is the name and version displayed in the SonarCloud UI.
sonar.projectName=ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101205953
sonar.projectVersion=1.0

# Path is relative to the sonar-project.properties file. Replace "\" by "/" on Windows.
sonar.sources=src

# Encoding of the source code. Default is default system encoding
sonar.sourceEncoding=UTF-8

# Coverage info
sonar.javascript.lcov.reportPaths=coverage/lcov.info
~~~

Esto nos permite realizar un análisis del repositorio con cada push o pull request. Además, deberemos configurar la Quality Gate para que se realice el análisis en base a la versión anterior. Con esto, obtenemos un badge que se colocará al inicio del fichero README.md.

### **Problemas e incidencias encontrados**

La principal incidencia ha surgido a la hora de realizar las pruebas tanto del cliente como del servidor, puesto que al estar utilizando métodos asíncronos, estas no funcionaban de la manera esperada. Por tanto, fue necesario cambiar el servidor a una clase de manera que se pudiera instanciar un servidor distinto en cada prueba. En el caso del cliente, tal y como estaba estructurado haciendo uso del módulo yargs fue imposible realizar las pruebas para él.

