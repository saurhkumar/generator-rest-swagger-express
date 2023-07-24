<!-- ABOUT THE PROJECT -->

<div id="top"></div>

## About The Project

A full fledge rest app powered by express. The idea of this project is to bring up your microservices fast, with inbuilt request validations, connection to the database
and fully working rest APIs.  
**Note** This project is generated through [generator-rest-swagger-express](https://www.npmjs.com/package/generator-rest-swagger-express)  
To see all the application features, see [feature](#service-features) section:  
<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.

### Prerequisites

- You need a MySQL up and running. To do that, use docker  
  You can run it as a [docker](https://hub.docker.com/_/mysql) or install it as a [standalone application](https://www.mysql.com/). Note you have to create two additional databases also to run this project. There is one docker compose file in test folder docker-compose.yml (`/test/docker-compose.yml`), you can use it to run and create the docker image with the required databases. If you want to use the cloud database, then change the setting in the default.json (`/config/default.json`)
  Note: In your local setup, by default service will connect to the test database. To see the database name and database authentication details see default.json file
- Node.js > v14 needed. You can get it [here](https://nodejs.org/en/download/)
- Better install mocha on global level `npm install --global mocha`

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

1. Go to your command-line interface and type `npm install`. ( here assumption is mongoDB is available)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Type `npm start`. Few lines will comes up and then go to ["http://localhost:3000/<%= serviceName %>/docs"](<http://localhost:3000/><%= serviceName %>/docs/#/). You should see swagger doc

<p align="right">(<a href="#top">back to top</a>)</p>
<!-- Explore -->
## Explore The Project

Once you generate this project using [generator](https://www.npmjs.com/package/generator-rest-swagger-express), you will see this kind of directory structure.  
The top-level working of this project is like

```
 |-app.js
 |-.eslintrc.js
 |-.gitignore
 |-.prettierrc.json
 |-logger.js
 |-package.json
 |-Readme.md
 |-api
 | |-controllers
 | | |-controller.js
 | | |-metricController.js
 | |-helpers
 | | |-shortId.js
 | |-services
 | | |-service.js
 | | |-syncService.js
 | |-swagger
 | | |-swagger.json
 |-config
 | |-custom-environment-variables.json
 | |-default.json
 | |-development.json
 | |-production.json
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

`/api/helpers/middlewares` This module is initializing Prometheus metrics right now, for every rest end point. In the same way, this middleware can be used for auth and other methods that need to be invoked before any API call.  

`/api/helpers/mongoFilter.pegjs` and `/api/helpers/mongoFilter.js` The pegjs file is the grammar that is empowering GET and DELETE APIs [filter](#filter) parameter. The `mongoFilter.js` is generated using this pegjs file, and this `mongoFilter.js` file converts the filter query into the database query.  
To generate or customize the filters see [Pegjs](https://pegjs.org/)  
To see what kind of queries can be used and how to use this see [filter](#filter) section  

`/api/helpers/queryHooksjs` see [filter](#filter) section.  

Reqest flow diagram  
![Alt text](./flowDiagram.drawio.svg)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Service Features -->
## Service Features

This service has out of the box support [sorting](#sorting), [filter](#filter), [projection](#projection) and [pagination](#pagination), background tasks, [Metrics](#metrics)  
Assuming this service have `name, age, address, country` fields in the the schema. Then following features are available  

<!-- Managing configurations-->

## Managing configurations

All the service configurations are managed through [config](https://www.npmjs.com/package/config) npm package. For your local development, all the configurations are under `config/default.json`. You can override these in production or in dev environment using `config/production.json`or `config/development.json`. The current default database configuration looks like

```
...
  "Database": {
    "server": "localhost",  --- database server URL
    "name": "test",                         --- database name
    "user": "admin",
    "password": "admin",
    "logging": false
  },
...
```
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

 To visualize and interact with the API’s resources go to ["http://localhost:3000/<%= serviceName %>/docs"](<http://localhost:3000/><%= serviceName %>/docs/#/)

 <p align="right">(<a href="#top">back to top</a>)</p>

<!-- Request and response validation -->
## Request and response validation

Define your request body or request parameter in the swagger file (`api/swagger/swagger.json`). To know more about the definitions, see [Swagger Documentation](https://swagger.io/specification/). According to the definitions defined in the swagger, all the validations will be performed.

 <p align="right">(<a href="#top">back to top</a>)</p>

<!-- Application Metrics -->
## Metrics

All the application metrics like CPU usages, event lag delay, TPM, and p95 are available.

The application `/metrics` end point gives the [prometheus](https://prometheus.io/) compatible data. If you want to see what it will look likes, just inside the `metric` folder and docker-compose-up command. It will run Prometheus on the 9090 port and Grafann on the 9000 port. Go to Grafana dashboard. Go to grafana dashboard [locally](http://localhost:9000/). You should see something like:
![Sample Grafan Dashboard](metrics/Capture.PNG "Sample Grafan Dashboard")

<p align="right">(<a href="#top">back to top</a>)</p>

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
