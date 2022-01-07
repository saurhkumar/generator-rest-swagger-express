<!-- ABOUT THE PROJECT -->

<div id="top"></div>

## About The Project

Simple rest app powered by express and mySQL.

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

- You need a mySQL server up and running and it must have two databases `test` and `unittest` (of course you can change names, just see default.json file)  
  You can run it as a [docker](https://hub.docker.com/_/mysql) or install it as a [standalone application](https://www.mysql.com/downloads/)

- Node.js > v14 needed. You can get it [here](https://nodejs.org/en/download/)
- Better install mocha on global level `npm install --global mocha`

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

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add basic test cases
- [ ] Add correlationId to every log
- [ ] Add projection support
- [ ] Add pagination and projection test cases

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
