const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const path = require('path')
const { addTestAnswers } = require('./scenarios')
module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  },
  prompts: {
    name: {
      when: "isNotTest",
      type: "string",
      required: true,
      message: "项目名称"
    },
    description: {
      when: "isNotTest",
      type: "string",
      required: false,
      message: "项目描述",
      default: "a vue project"
    },
    version: {
      when: "isNotTest",
      type: 'string',
      default: '1.0.0'
    },
    author: {
      when: "isNotTest",
      type: "string",
      message: "作者"
    },
    router: {
      when: "isNotTest",
      type: "confirm",
      message: "安装vue-router?"
    },
    vuex: {
      when: "isNotTest",
      type: 'confirm',
      message: '安装vuex?'
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ]
    }
  },
  filters: {
    'src/router/**/*': "router",
    'src/store/**/*': "vuex"
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  }
};
