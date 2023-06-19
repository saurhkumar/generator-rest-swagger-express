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
        message: 'Your service name. Do not use any special characters',
        default: 'User'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your service description',
        default: 'myApp rest interface'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Your service version',
        default: '0.0.0'
      },

      {
        type: 'list',
        name: 'appType',
        message: 'Select application type',
        choices: ['CRUD', 'NonCRUD'],
        default: 'CRUD'
      },
      {
        type: 'input',
        name: 'objectName',
        when: function (response) {
          let result = false;
          if (response.appType == 'CRUD') {
            result = true;
          }
          return result;
        },
        message: 'Object name',
        default: function (response) {
          return response.serviceName;
        }
      },
      {
        type: 'list',
        name: 'appBackend',
        when: function (response) {
          let result = false;
          if (response.appType == 'CRUD') {
            result = true;
          }
          return result;
        },
        message: 'Select your application backend',
        choices: ['MongoDB', 'MySQL'],
        default: 'MongoDB'
      }
    ]);
  }

  writing() {
    this.destinationRoot(
      path.join(
        this.destinationRoot(),
        '/' + this._lowerCaseFirstLetter(this.answers.serviceName)
      )
    );
    // for common files
    this.fs.copyTpl(
      glob.sync(this.templatePath('common/**/*'), { dot: true }),
      this.destinationPath(),
      {
        serviceName: this.answers.serviceName,
        description: this.answers.description,
        version: this.answers.version
      }
    );

    // for helpers
    this.fs.copyTpl(
      glob.sync(this.templatePath('helpers/**/*')),
      this.destinationPath(`api/helpers`)
    );

    // for specific files
    if (this.answers.appType == 'NonCRUD') {
      this.fs.copyTpl(
        glob.sync(this.templatePath('nonCrud/**/*')),
        this.destinationPath(),
        {
          serviceName: this.answers.serviceName,
          description: this.answers.description,
          version: this.answers.version
        }
      );
    } else {
      // copy common files
      let dbModel =
        this.answers.appBackend == 'MySQL' ? 'sqlModel' : 'mongoDbModel';
      this.fs.copyTpl(
        glob.sync(this.templatePath('crud/common/**/*')),
        this.destinationPath(),
        {
          serviceName: this.answers.serviceName,
          description: this.answers.description,
          version: this.answers.version,
          appBackend: this.answers.appBackend,
          objectName: this._capitalizeFirstLetter(this.answers.objectName),
          objectNameLowerCase: this._lowerCaseFirstLetter(
            this.answers.objectName
          ),
          dbModel: dbModel
        }
      );

      if (this.answers.appBackend == 'MySQL') {
        this.fs.copyTpl(
          glob.sync(this.templatePath('crud/SQL/**/*')),
          this.destinationPath(),
          {
            serviceName: this.answers.serviceName,
            description: this.answers.description,
            version: this.answers.version,
            objectName: this._capitalizeFirstLetter(this.answers.objectName),
            objectNameLowerCase: this._lowerCaseFirstLetter(
              this.answers.objectName
            )
          }
        );
        this.fs.copyTpl(
          glob.sync(this.templatePath('crud/SQLHelpers/**/*')),
          this.destinationPath(`api/helpers`)
        );
      } else {
        this.fs.copyTpl(
          glob.sync(this.templatePath('crud/mongo/**/*')),
          this.destinationPath(),
          {
            serviceName: this.answers.serviceName,
            description: this.answers.description,
            version: this.answers.version,
            objectName: this._capitalizeFirstLetter(this.answers.objectName),
            objectNameLowerCase: this._lowerCaseFirstLetter(
              this.answers.objectName
            )
          }
        );

        this.fs.copyTpl(
          glob.sync(this.templatePath('crud/mongoHelpers/**/*')),
          this.destinationPath(`api/helpers`)
        );
      }
    }
  }

  _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  _lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  end() {
    this.spawnCommandSync('npm', ['i']);
    this.log('Your microservice is ready!');
  }
};
