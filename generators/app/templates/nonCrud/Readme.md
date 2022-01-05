<!-- ABOUT THE PROJECT -->

<div id="top"></div>

## About The Project

Simple Non Crud Rest app powered by express.

<!-- GETTING STARTED -->

### Built With

This section list all major frameworks/libraries used in this project.

- [Node](https://nodejs.org)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [Mocha](https://mochajs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

This is an example of how you may give instructions on setting up your project locally.

### Prerequisites

- None

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

1. Go to your command-line interface and type `npm install`. ( here assumption is mysql is available)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Type `npm start`. Few lines will comes up and then go to ["http://localhost:3000/<%= serviceName %>/docs"](http://localhost:3000/<%= serviceName %>/docs/#/). You should see swagger doc

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

1. Out of the box swaggerUI, swagger validation and test cases added
2. Test cases available with 100 % coverage

To see what the is the use of specific file, see generator readme.

<p align="right">(<a href="#top">back to top</a>)</p>

## Explore your project

The project structure is like this:

```
 |-api
 | |-controllers
 | | |-controller.js
 | |-helpers
 | | |-als.js
 | | |-shortId.js
 | |-services
 | | |-service.js
 | | |-syncService.js
 | |-swagger
 | | |-swagger.json
 |-app.js
 |-config
 | |-custom-environment-variables.json
 | |-default.json
 | |-development.json
 | |-production.json
 |-logger.js
 |-package-lock.json
 |-package.json
 |-Readme.md
 |-test
 | |-test.js
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add basic test cases
- [ ] Add correlationId to every log
    Just a test app to getting started
<p align="right">(<a href="#top">back to top</a>)</p>
