<!-- ABOUT THE PROJECT -->

<div id="top"></div>

## About The Project

RESTful API generator with swagger integration using NodeJS and Express.

## Supported Backend

Following backends are supported

- [x] Non-CRUD (Without any database, just simple get call)
- [x] MongoDB
- [x] MYSQL

It supports SQL and options now, but other databases support is on the way

<!-- GETTING STARTED -->

### Built With

This section list all major frameworks/libraries used in this project.

- [Node](https://nodejs.org)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [Config](https://github.com/lorenwest/node-config)
- [Mocha](https://mochajs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Non CRUD Application  
  None
- CRUD Application  
  Specific database needed, let's say you are running MYSQL based app then MYSQL server needed, for more details see your generated app

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

Go to your command-line interface and type `npm install -g yo generator-rest-swagger-express`

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Go to your command-line interface and type `yo rest-swagger-express` and answer the prompts.  
If the generator is installed correctly, your prompt should looks :

```
$ yo rest-swagger-express
? Your service name myApp
? Your service description myApp rest interface
? Your service version 0.0.0
? Select application type CRUD
? Object name User
? Select your application backend MongoDB
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Generated Application Details

**Note:** Below information is applicable CRUD/Non-CRUD

Usually your generated project directory should like this:

```
 |-app.js <--- Entry point of your application
 |-api
 | |-controllers <--- Directory for all your controllers
 | | |-controller.js
 | |-helpers <--- Directory for all your controllers
 | | |-als.js
 | | |-shortId.js
 | |-services <--- Directory for all your controllers
 | | |-service.js
 | | |-syncService.js <--- Process you want to trigger when app starts
 | |-swagger
 | | |-swagger.json <--- OpenAPI Specification file
 |-config <--- Directory for your config
 | |-custom-environment-variables.json
 | |-default.json
 | |-development.json
 | |-production.json
 |-logger.js <--- General purpose logger file
 |-package.json <--- NPM package file
 |-Readme.md
 |-test
 | |-test.js
```

1. **app.js** : This is the entry point of your application, it has logic to start  
   database connection, background process, initialize middleware and so.
2. **syncService.js** : You can add a background process, that you want to trigger when the application starts

<p align="right">(<a href="#top">back to top</a>)</p>

### Configuration Management

This generator uses the `config` node package to manage all your external configuration. To know more, what's the use of different files in `/config` directory, visit the [Config](https://www.npmjs.com/package/config) page

<p align="right">(<a href="#top">back to top</a>)</p>

### Test's Logs

Once you run test cases (using the command `npm test`), a /unittest.log file will be generated. In your terminal, you will only see all passed and failed tests. To see test logs open the /unittest.log file. This file will regenerate with every test case run. If you want to see all the logs when the test runs, go to your test file `/test/test.js` and comment out `logger('unittest.log').switchToFile();`

<p align="right">(<a href="#top">back to top</a>)</p>

### How to additional REST paths

1. Go to you swagger file `api/swagger/swagger.json` and add new path definition, under paths add something like this

   ```
     "paths": {
       "/newPath": {
         "x-controller": "yourControllerFile", <---- this is a controller file name under /api/controllers
         "get": {
             "operationId": "yourFunctionName",  <---- this is a function name in the yourControllerFile
             ...
           }
         }
       },
   ```

   To know more about the swagger path definition see [official docs](https://swagger.io/specification)

2. Add controller file `yourControllerFile` in `api/controllers` directory and function `yourFunctionName`.

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

1. Out of the box swaggerUI, swagger validation, REST API
2. Test cases available with 100 % coverage

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add basic test cases
- [x] Add MongoDB support
- [x] Add in-memory cache support
- [ ] Health check Api's
- [ ] Add [correlationId](https://microsoft.github.io/code-with-engineering-playbook/observability/correlation-id/) to every log
- [ ] Add projection and sort support
- [ ] Add pagination and projection test cases
- [ ] Add [Observability tools](https://www.baeldung.com/distributed-systems-observability)
- [ ] Add Cassandra DB support

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>
