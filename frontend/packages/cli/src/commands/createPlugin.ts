const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const replace = require('replace-in-file');
const dashify = require('dashify');
const inquirer = require('inquirer');
const handlebars = require('handlebars');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const lowercaseFirstLetter = str => str.charAt(0).toLowerCase() + str.slice(1);

const appendTextFile = (file, textToAppend) => {
  const originalContents = fs.readFileSync(file, 'utf8');

  // Make sure that there is a newline before and after the new text
  if (originalContents && !originalContents.endsWith('\n')) {
    textToAppend = `\n${textToAppend}`;
  }
  if (textToAppend && !textToAppend.endsWith('\n')) {
    textToAppend = `${textToAppend}\n`;
  }

  fs.appendFileSync(file, textToAppend);
};

const questions = [
  {
    type: 'input',
    name: 'id',
    message:
      "Enter an ID for the plugin (Please capitalize) e.g. 'MyAwesomePlugin' [required]",
    validate: value => (value ? true : 'Please enter an ID for the plugin'),
  },
  {
    type: 'confirm',
    name: 'ts',
    message: 'Use Typescript?',
  },
  {
    type: 'input',
    name: 'owner',
    message: 'Which squad will own this plugin? [required]',
    validate: value =>
      value ? true : 'Please enter a squad that will own the plugin',
  },
  {
    type: 'input',
    name: 'title',
    message: "Enter a title for the plugin e.g. 'My Awesome Plugin' [optional]",
    default: '',
  },
  {
    type: 'input',
    name: 'desc',
    message:
      "Enter a description for the plugin e.g. 'This Plugin does all awesome things!' [optional]",
    default: '',
  },
  {
    type: 'input',
    name: 'author',
    message: "Author's slack handle e.g. alund [optional]",
    default: '',
  },
  {
    type: 'input',
    name: 'support_channel',
    message:
      'Slack channel to contact for support on this plugin e.g. data-support [optional]',
    default: '',
  },
];

const createPluginCommand = () => {
  inquirer.prompt(questions).then(answers => {
    const pluginId = capitalize(answers.id);

    const pluginFolderName = lowercaseFirstLetter(
      pluginId.replace(/Plugin/g, ''),
    );
    answers.folder = pluginFolderName;

    const pluginRoute = `/${dashify(pluginFolderName)}`;
    answers.route = pluginRoute;

    const pluginRoot = path.join(__dirname, '../src/plugins/');
    const source = path.join(pluginRoot, 'scaffold');
    const destination = path.join(pluginRoot, pluginFolderName);

    const pluginImportText = `import { ${pluginId} } from 'plugins/${pluginFolderName}';\n// @@import`;
    const pluginDefinitionText = `${pluginId},\n  // @@definition`;
    const pluginManagerBootstrap = path.join(
      pluginRoot,
      'pluginManagerBootstrap.js',
    );

    if (fs.existsSync(destination)) {
      return console.error(
        `Uh Oh! Looks like another plugin exists with the same name.\nPlease check ${destination} directory.`,
      );
    }

    try {
      fs.mkdirSync(destination);

      const compileFileAndWrite = (sourceFile, destFile) => {
        const hbFile = fs.readFileSync(path.join(source, sourceFile));
        const template = handlebars.compile(hbFile.toString());
        const contents = template({ name: destFile, ...answers });
        fs.writeFile(path.join(destination, destFile), contents, err => {
          if (err) {
            return console.log(
              'Error writing file ',
              path.join(destination, destFile),
            );
          }
          console.log('Wrote ', path.join(destination, destFile));
        });
      };

      ['Page', 'Plugin'].forEach(fileType => {
        compileFileAndWrite(
          `Scaffold${fileType}.hbs`,
          `${pluginId}${fileType}${answers.ts ? '.tsx' : '.js'}`,
        );
      });

      compileFileAndWrite('ScaffoldPage.test.hbs', `${pluginId}Page.test.js`);
      compileFileAndWrite('plugin-info.hbs', 'plugin-info.yaml');
      compileFileAndWrite('index.hbs', 'index.js');
      appendTextFile(
        '.github/CODEOWNERS',
        `/src/plugins/${pluginFolderName}/ @backstage/${answers.owner}`,
      );

      // import and add plugin to bootstrap
      const options = {
        files: pluginManagerBootstrap,
        from: [/\/\/ @@import/g, /\/\/ @@definition/],
        to: [pluginImportText, pluginDefinitionText],
      };

      replace(options, err => {
        if (err) {
          return console.error(err);
        }
        console.log('');
        console.log(
          'Added plugin to bootstrap, and the plugin directory to CODEOWNERS.',
        );
        console.log(
          `You are all set! Check http://localhost:5678${pluginRoute}`,
        );
        console.log('');
        console.log(
          'NOTE: First thing to do now should be to create a Pull Request and wait for the',
        );
        console.log(
          'current goalie of the Tools squad to review and merge it. After that is done,',
        );
        console.log(
          'through the use of the CODEOWNERS feature, you should be able to continue',
        );
        console.log('development inside your plugin directory on your own.');
        console.log('');
        console.log('Hack away!');
      });
    } catch (e) {
      console.error(e);
      fsExtra.removeSync(destination);
      const options = {
        files: pluginManagerBootstrap,
        from: [pluginImportText, pluginImportText],
        to: [/\/\/ @@import/g, /\/\/ @@definition/],
      };

      replace(options, err => {
        if (err) {
          return console.error(err);
        }
        console.log('Cleaned up');
      });
    }
  });
};

export default createPluginCommand;
