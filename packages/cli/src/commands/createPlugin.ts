import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';
import chalk from 'chalk';
import inquirer, { Answers, Question } from 'inquirer';
import recursive from 'recursive-readdir';
import { promisify } from 'util';
import { exec } from 'child_process';
import { resolve as resolvePath } from 'path';
import { realpathSync, existsSync } from 'fs';
import os from 'os';
import ora from 'ora';

const MARKER_SUCCESS = chalk.green(` ✔︎\n`);
const MARKER_FAILURE = chalk.red(` ✘\n`);

const checkExists = (rootDir: string, id: string) => {
  console.log();
  console.log(chalk.green(' Checking if the plugin already exists:'));

  const destination = path.join(rootDir, 'packages', 'plugins', id);

  if (fs.existsSync(destination)) {
    console.log(
      chalk.red(
        `  plugin ID\t${chalk.cyan(id)} already exists${MARKER_FAILURE}`,
      ),
    );
    throw new Error(
      `A plugin with the same name already exists: ${chalk.cyan(
        destination.replace(`${rootDir}/`, ''),
      )}\nPlease try again with a different plugin ID`,
    );
  }
  console.log(
    chalk.green(`  plugin ID\t${chalk.cyan(id)} is available${MARKER_SUCCESS}`),
  );
};

export const createTemporaryPluginFolder = (tempDir: string) => {
  console.log();
  console.log(chalk.green(' Creating a temporary plugin directory:'));

  process.stdout.write(
    chalk.green(`  creating\t${chalk.cyan('temporary')} directory`),
  );
  try {
    fs.mkdirSync(tempDir);
    process.stdout.write(MARKER_SUCCESS);
  } catch (e) {
    process.stdout.write(MARKER_FAILURE);
    throw new Error(
      `Failed to create temporary plugin directory: ${e.message}`,
    );
  }
};

export const createFileFromTemplate = (
  source: string,
  destination: string,
  answers: Answers,
) => {
  const template = fs.readFileSync(source);
  const compiled = handlebars.compile(template.toString());
  const contents = compiled({
    name: path.basename(destination),
    ...answers,
  });
  try {
    fs.writeFileSync(destination, contents);
    process.stdout.write(MARKER_SUCCESS);
  } catch (e) {
    process.stdout.write(MARKER_FAILURE);
    throw new Error(`Failed to create file: ${destination}: ${e.message}`);
  }
};

const sortObjectByKeys = (obj: { [name in string]: string }) => {
  return Object.keys(obj)
    .sort()
    .reduce((result, key: string) => {
      result[key] = obj[key];
      return result;
    }, {} as { [name in string]: string });
};

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const addExportStatement = (file: string, exportStatement: string) => {
  const newContents = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean) // get rid of empty lines
    .concat([exportStatement])
    .sort()
    .concat(['']) // newline at end of file
    .join('\n');

  fs.writeFileSync(file, newContents, 'utf8');
};

export const addPluginDependencyToApp = (
  rootDir: string,
  pluginName: string,
) => {
  console.log();
  console.log(chalk.green(' Adding plugin as dependency in app:'));

  const pluginPackage = `@spotify-backstage/plugin-${pluginName}`;
  const pluginPackageVersion = '0.0.0';
  const packageFile = path.join(rootDir, 'packages', 'app', 'package.json');

  process.stdout.write(
    chalk.green(
      `  processing\t${chalk.cyan(packageFile.replace(`${rootDir}/`, ''))}`,
    ),
  );

  try {
    const packageFileContent = fs.readFileSync(packageFile, 'utf-8');
    const packageFileJson = JSON.parse(packageFileContent);
    const dependencies = packageFileJson.dependencies;

    if (dependencies[pluginPackage]) {
      throw new Error(
        `Plugin ${pluginPackage} already exists in ${packageFile}`,
      );
    }

    dependencies[pluginPackage] = pluginPackageVersion;
    packageFileJson.dependencies = sortObjectByKeys(dependencies);
    fs.writeFileSync(
      packageFile,
      `${JSON.stringify(packageFileJson, null, 2)}\n`,
      'utf-8',
    );
  } catch (e) {
    process.stdout.write(MARKER_FAILURE);
    throw new Error(
      `Failed to add plugin as dependency in app: ${packageFile}: ${e.message}`,
    );
  }

  process.stdout.write(MARKER_SUCCESS);
};

export const addPluginToApp = (rootDir: string, pluginName: string) => {
  console.log();
  console.log(chalk.green(' Import plugin in app:'));

  const pluginPackage = `@spotify-backstage/plugin-${pluginName}`;
  const pluginNameCapitalized = pluginName
    .split('-')
    .map(name => capitalize(name))
    .join('');
  const pluginExport = `export { default as ${pluginNameCapitalized} } from '${pluginPackage}';`;
  const pluginsFile = path.join(
    rootDir,
    'packages',
    'app',
    'src',
    'plugins.ts',
  );
  process.stdout.write(
    chalk.green(
      `  processing\t${chalk.cyan(pluginsFile.replace(`${rootDir}/`, ''))}`,
    ),
  );

  try {
    addExportStatement(pluginsFile, pluginExport);
  } catch (e) {
    process.stdout.write(MARKER_FAILURE);
    throw new Error(
      `Failed to import plugin in app: ${pluginsFile}: ${e.message}`,
    );
  }

  process.stdout.write(MARKER_SUCCESS);
};

export const createFromTemplateDir = async (
  templateFolder: string,
  destinationFolder: string,
  answers: Answers,
) => {
  console.log();
  console.log(chalk.green(' Reading template files:'));

  let files = [];

  try {
    files = await recursive(templateFolder);
    console.log(
      chalk.green(
        `  reading\t${chalk.cyan(`${files.length} files`)}${MARKER_SUCCESS}`,
      ),
    );
  } catch (e) {
    console.log(
      chalk.red(`  reading\t${chalk.cyan('0')} files${MARKER_FAILURE}`),
    );
    throw new Error(`Failed to read files in template directory: ${e.message}`);
  }

  console.log();
  console.log(chalk.green(' Setting up the plugin files:'));
  files.forEach(file => {
    process.stdout.write(
      chalk.green(`  processing\t${chalk.cyan(path.basename(file))}`),
    );
    fs.ensureDirSync(
      file
        .replace(templateFolder, destinationFolder)
        .replace(path.basename(file), ''),
    );
    if (file.endsWith('hbs')) {
      createFileFromTemplate(
        file,
        file.replace(templateFolder, destinationFolder).replace(/\.hbs$/, ''),
        answers,
      );
    } else {
      try {
        fs.copyFileSync(file, file.replace(templateFolder, destinationFolder));
        process.stdout.write(MARKER_SUCCESS);
      } catch (e) {
        process.stdout.write(MARKER_FAILURE);
        throw new Error(
          `Failed to copy file: ${file.replace(
            templateFolder,
            destinationFolder,
          )}: ${e.message}`,
        );
      }
    }
  });
};

const cleanUp = async (tempDir: string, id: string) => {
  console.log(
    chalk.green(
      `It seems that something went wrong when creating the plugin 🤔 `,
    ),
  );
  console.log(
    chalk.green('We are going to clean up, and then you can try again.'),
  );
  const spinner = ora({
    prefixText: chalk.green(` Cleaning up\t${chalk.cyan(id)}`),
    spinner: 'arc',
    color: 'green',
  }).start();
  try {
    await fs.remove(tempDir);
    spinner.succeed();
  } catch (e) {
    spinner.fail();
    console.log(chalk.red(`Failed to cleanup: ${e.message}`));
  }
};

const buildPlugin = async (pluginFolder: string) => {
  console.log();
  console.log(chalk.green(` Building the plugin:`));

  const prom_exec = promisify(exec);

  const commands = ['yarn install', 'yarn build'];
  for (const command of commands) {
    const spinner = ora({
      prefixText: chalk.green(`  executing\t${chalk.cyan(command)}`),
      spinner: 'arc',
      color: 'green',
    }).start();
    try {
      process.chdir(pluginFolder);
      await prom_exec(command, { timeout: 60000 });
      spinner.succeed();
    } catch (e) {
      spinner.fail();
      throw new Error(
        `Could not execute command ${chalk.cyan(command)}: ${e.message}`,
      );
    }
  }
};

export const movePlugin = (
  tempDir: string,
  destination: string,
  id: string,
) => {
  console.log();
  console.log(chalk.green(` Moving the plugin:`));

  process.stdout.write(
    chalk.green(`  moving\t${chalk.cyan(id)} to final location`),
  );
  try {
    fs.moveSync(tempDir, destination);
    process.stdout.write(MARKER_SUCCESS);
  } catch (e) {
    process.stdout.write(MARKER_FAILURE);
    throw new Error(`Failed to move plugin: ${e.message}`);
  }
};

const createPlugin = async () => {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'id',
      message: chalk.blue('Enter an ID for the plugin [required]'),
      validate: (value: any) =>
        value ? true : chalk.red('Please enter an ID for the plugin'),
    },
  ];
  const answers: Answers = await inquirer.prompt(questions);

  const rootDir = realpathSync(process.cwd());
  const appPackage = resolvePath(rootDir, 'packages', 'app');
  const cliPackage = resolvePath(__dirname, '..', '..');
  const templateFolder = resolvePath(cliPackage, 'templates', 'default-plugin');
  const tempDir = path.join(os.tmpdir(), answers.id);
  const pluginDir = path.join(
    rootDir,
    '..',
    '..',
    'packages',
    'plugins',
    answers.id,
  );

  console.log();
  console.log(chalk.green('Creating the plugin...'));

  try {
    checkExists(rootDir, answers.id);
    createTemporaryPluginFolder(tempDir);
    await createFromTemplateDir(templateFolder, tempDir, answers);
    movePlugin(tempDir, pluginDir, answers.id);
    await buildPlugin(pluginDir);

    if (existsSync(appPackage)) {
      addPluginDependencyToApp(rootDir, answers.id);
      addPluginToApp(rootDir, answers.id);
    }

    console.log();
    console.log(
      chalk.green(
        `🥇  Successfully created ${chalk.cyan(
          `@spotify-backstage/plugin-${answers.id}`,
        )}`,
      ),
    );
    console.log();
  } catch (e) {
    console.log();
    console.log(`${chalk.red(e.message)}`);
    console.log();
    await cleanUp(tempDir, answers.id);
    console.log();
    console.log(`🔥  ${chalk.red('Failed to create plugin!')}`);
    console.log();
  }
};

export default createPlugin;
