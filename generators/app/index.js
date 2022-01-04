const Generator = require('yeoman-generator');
const glob = require('glob');
const path = require('path');
module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  configuring() {}

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'serviceName',
        message: 'Your service name',
        default: 'myApp',
        store: true
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your service description',
        default: 'myApp rest interface',
        store: true
      },
      {
        type: 'input',
        name: 'version',
        message: 'Your service version',
        default: '0.0.0',
        store: true
      },
      {
        type: 'input',
        name: 'objectName',
        message: 'Object name',
        default: 'User',
        store: true
      }
    ]);
  }

  writing() {
    this.destinationRoot(
      path.join(this.destinationRoot(), '/' + this.answers.serviceName)
    );
    // for common files
    this.fs.copyTpl(
      glob.sync(this.templatePath('common/**/*')), //this.templatePath('index.html'),
      this.destinationPath(),
      {
        serviceName: this.answers.serviceName,
        description: this.answers.description,
        version: this.answers.version
      } // user answer `name` used
    );

    // for helpers
    this.fs.copyTpl(
      glob.sync(this.templatePath('helpers/**/*')), //this.templatePath('index.html'),
      this.destinationPath(`api/helpers`)
    );

    // for specific files
    this.fs.copyTpl(
      glob.sync(this.templatePath('nonCrud/**/*')),
      this.destinationPath(),
      {
        serviceName: this.answers.serviceName,
        description: this.answers.description,
        version: this.answers.version
      }
    );
  }

  end() {
    this.spawnCommandSync('npm', ['i']);
    this.log('Your microservice is ready!');
  }
};
