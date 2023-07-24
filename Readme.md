<!-- ABOUT THE PROJECT -->

<div id="top"></div>

## About The Project

Note: If you wanted to see how generated application will look like see [mongoDB base user-service](https://github.com/saurhkumar/mongoCrud) and [SQL based user-service](https://github.com/saurhkumar/sqlCrud)

RESTful API generator with swagger integration using NodeJS and Express. This project generates afull fledge rest app powered by express. The idea of this project
is to bring up your microservices fast, with inbuilt request validations, connection to the database and fully working rest APIs To see all the application
features, see [feature](#service-features) section:  

## Supported Backend

Following backends are supported

- [x] Non-CRUD (Without any database, just simple get call)
- [x] MongoDB
- [x] MYSQL

It supports SQL and MongoDB now, but other databases support is on the way

<!-- GETTING STARTED -->

### Built With

This section list all major frameworks/libraries used in this project.

- [Node](https://nodejs.org)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [Config](https://github.com/lorenwest/node-config)
- [Mocha](https://mochajs.org/)
- and many more

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Non CRUD Application  
  None
- CRUD Application  
  Specific database needed, let's say you are running MYSQL based app then MYSQL server needed, for more details see your generated app

<p align="right">(<a href="#top">back to top</a>)</p>

### How to install

Go to your command-line interface and type `npm install -g yo generator-rest-swagger-express`

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## How to generate micro service

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

Once all the prompts are done, a new micro-service will be generated under name `myApp`. To see all the generated app feature, check
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

Here is a detailed description of most of the files  

`app.js` This is a starting point of the application, initializing the validations and swagger UI, all of the REST API path (using `/api/swagger/swagger.json`)

`.eslintrc.js` This file contain all [linting](https://eslint.org/) rules for this project  

`.prettierrc.json` This file contain all [Prettier](https://prettier.io/) rules for this project

`logger.js` This is a wrapper around [Winston](https://www.npmjs.com/package/winston)  

`/api/controllers/*` This directory has all the controllers. These controllers are to format your request and response.  

The `metricController` is exposing the [Prometheus](https://prometheus.io/) data via `/metrics` end point. If you want to see some example charts, explore the `metric` directory at the root level

`/api/serivce/*` This directory has all the services. Every rest end point has its own serivce function that can be used to add business logic or to interact with external services.  

The sync service (`/api/services/syncService.js`) initilize the database connecton, apart from that, it can be used to start a background process.  

For rest of the files, generate the app and see the application Readme

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Service Features -->
## Service Features

This service has out of the box support [sorting](#sorting), [filter](#filter), [projection](#projection) and [pagination](#pagination), background tasks, [Metrics](#metrics)  
Assuming this service have `name, age, address, country` fields in the the schema. Then following features are available  

<!-- Sorting -->
## Sorting

In the get request, documents can sorted `$sortBy` parameter. Documents can be sorted in both ascending and descending direction. Ex: `+age -name` to sort the documents by age in ascending order and name is descending order.  
To control what fields you can sort, go to `/api/helpers/queryHooks.js` and inside the `mapping` function modify the `sortFields` keys. Assuming, you want to enable `name` and `age` sorting, then the sortField in the mapping function will be like:

```
  ...
  function mapping() {
    return {
      sortFields: ['name', 'age'],
  ...
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Filter -->
## Filter

Documents can be filtered using the parameter `$filter` by writing SQL-like statements. For example, to get all documents where the age is in ['23', '45'] and address = 'address1', the parameter `$filter` should be like `age in ( '23', '45') and address = 'address1'`.  
Here one thing to note down is the quotes (`''`) around all the values, these quotes are always required, for every value. Right now `integer`, `string`, `boolean`, and `date` data types are supported. To add more data type support, see `/api/helpers/mongoFilter.pegjs` file. For more examples see filter test cases.  

To control what fields you can filter, go to `/api/helpers/queryHooks.js` and inside the `mapping` function modify the `queryFields` keys. Assuming, you want to enable `name` and `age` filter, then the queryFields in the mapping function will be like:

```
  ...
  function mapping() {
    ...
      queryFields: [
        { name: 'name', type: 'string' },
        { name: 'age', type: 'int' }
      ],
    ...
  ...
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Projection -->
## Projection

Projection is a way to select only the necessary data rather than selecting every column. Use the `$projection` parameter to define the projection fields. Assuming you want to get only `age` and `name` out of all the available columns in the database, then the `$projection` parameter will be like `age name`. For more examples see filter test cases.  

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Pagination -->
## Pagination

 By Default applications exposes, pagination parameters [$top](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#982-client-driven-paging) and [$skip](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#982-client-driven-paging).

 <p align="right">(<a href="#top">back to top</a>)</p>

<!-- Pagination -->
## Swagger UI

 To visualize and interact with the API’s resources go to ["http://localhost:3000/user-service/docs"](http://localhost:3000/user-service/docs/#/)

 <p align="right">(<a href="#top">back to top</a>)</p>

<!-- Request and response validation -->
## Request and response validation

Define your request body or request parameter in the swagger file (`api/swagger/swagger.json`). To know more about the definitions, see [Swagger Documentation](https://swagger.io/specification/). According to the definitions defined in the swagger, all the validations will be performed.

 <p align="right">(<a href="#top">back to top</a>)</p>

<!-- Application Metrics -->
## Metrics

All the application metrics like CPU usages, event lag delay, TPM, and p95 are available.
For more details, see your generated application

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

- [ ] Add [correlationId](https://microsoft.github.io/code-with-engineering-playbook/observability/correlation-id/) to every log
- [ ] Add [Observability tools](https://www.baeldung.com/distributed-systems-observability)
- [ ] Add Cassandra DB support
- [ ] Add SSE support

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
