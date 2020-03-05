import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';
import chalk from 'chalk';
import inquirer, { Answers, Question } from 'inquirer';
import recursive from 'recursive-readdir';
import { promisify } from 'util';
import { exec } from 'child_process';

export const createPluginFolder = (rootDir: string, id: string): string => {
  console.log();
  console.log(chalk.green(' Creating the plugin directory:'));

  const destination = path.join(rootDir, 'packages', 'plugins', id);

  if (fs.existsSync(destination)) {
    console.log(
      chalk.red(
        `  failed:\t ✗ ${chalk.cyan(destination.replace(rootDir, ''))}`,
      ),
    );
    throw new Error(
      `A plugin with the same name already exists: ${chalk.cyan(
        destination.replace(rootDir, ''),
      )}\nPlease try again with a different Plugin ID`,
    );
  }

  process.stdout.write(
    chalk.green(`  creating\t${chalk.cyan(destination.replace(rootDir, ''))}`),
  );
  try {
    fs.mkdirSync(destination, { recursive: true });
    process.stdout.write(chalk.green(' ✓\n'));
    return destination;
  } catch (e) {
    process.stdout.write(chalk.red(` ✗\n`));
    throw new Error(
      `Failed to create plugin directory: ${destination}: ${e.message}`,
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
    process.stdout.write(chalk.green(` ✓\n`));
  } catch (e) {
    process.stdout.write(chalk.red(` ✗\n`));
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
): string => {
  const pluginPackage = `@spotify-backstage/plugin-${pluginName}`;
  const pluginPackageVersion = '0.0.0';
  const packageFile = path.join(rootDir, 'packages', 'app', 'package.json');
  const packageFileContent = fs.readFileSync(packageFile, 'utf-8').toString();
  const packageFileJson = JSON.parse(packageFileContent);
  const dependencies = packageFileJson.dependencies;

  if (typeof dependencies[pluginPackage] !== 'undefined') {
    throw new Error(`Plugin ${pluginPackage} already exists in ${packageFile}`);
  }

  dependencies[pluginPackage] = pluginPackageVersion;
  packageFileJson.dependencies = sortObjectByKeys(dependencies);
  fs.writeFileSync(
    packageFile,
    `${JSON.stringify(packageFileJson, null, 2)}\n`,
    'utf-8',
  );
  return pluginPackage;
};

export const addPluginToApp = (rootDir: string, pluginName: string) => {
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

  addExportStatement(pluginsFile, pluginExport);
};

export const createFromTemplateDir = async (
  templateFolder: string,
  destinationFolder: string,
  answers: Answers,
) => {
  console.log();
  console.log(chalk.green(' Reading template files:'));

  let files = [];

  process.stdout.write(chalk.green(`  reading\t`));
  try {
    files = await recursive(templateFolder);
    process.stdout.write(
      chalk.green(`${chalk.cyan(`${files.length} files`)} ✓\n`),
    );
  } catch (e) {
    console.log(chalk.red(` ✗ 0 files\n`));
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
        process.stdout.write(chalk.green(` ✓\n`));
      } catch (e) {
        process.stdout.write(chalk.red(` ✗\n`));
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

const cleanUp = async (rootDir: string, id: string) => {
  const destination = path.join(rootDir, 'packages', 'plugins', id);

  const questions: Question[] = [
    {
      type: 'confirm',
      name: 'cleanup',
      message: chalk.yellow(
        `It seems that something went wrong when creating the plugin 🤔\nDo you want to remove the following directory and all the files in it:\n${chalk.cyan(
          destination,
        )}`,
      ),
    },
  ];
  const answers: Answers = await inquirer.prompt(questions);

  if (answers.cleanup) {
    console.log();
    console.log(chalk.green(`🧹  Cleaning up...`));
    console.log();
    console.log(chalk.green(` Removing plugin:`));
    process.stdout.write(
      chalk.green(
        `  deleting\t${chalk.cyan(destination.replace(rootDir, ''))}`,
      ),
    );
    try {
      // Not using recursion here, so only empty directories can be removed
      fs.rmdirSync(destination);
      process.stdout.write(chalk.green(` ✓\n`));
      console.log();
    } catch (e) {
      process.stdout.write(chalk.red(` ✗\n`));
      console.log();
      console.log(chalk.red(`Failed to cleanup: ${e.message}`));
    }
  }
};

const buildPlugin = async (pluginFolder: string) => {
  console.log();
  console.log(chalk.green(` Building the plugin:`));

  const prom_exec = promisify(exec);

  const commands = ['yarn install', 'yarn build'];
  for (const command of commands) {
    process.stdout.write(chalk.green(`  executing\t${chalk.cyan(command)}`));
    try {
      process.chdir(pluginFolder);
      await prom_exec(command, { timeout: 60000 });
      process.stdout.write(chalk.cyan(` ✓\n`));
    } catch (e) {
      process.stdout.write(chalk.red(` ✗\n`));
      throw new Error(
        `Could not execute command ${chalk.cyan(command)}: ${e.message}`,
      );
    }
  }
};

const createPlugin = async (): Promise<any> => {
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

  const currentDir = process.argv[1];
  const rootDir = path.join(currentDir, '..', '..', '..');
  const templateFolder = path.join(
    currentDir,
    '..',
    '..',
    '@spotify-backstage',
    'cli',
    'templates',
    'default-plugin',
  );

  try {
    console.log();
    console.log(chalk.green('🧩  Creating the plugin...'));

    const destinationFolder = createPluginFolder(rootDir, answers.id);
    await createFromTemplateDir(templateFolder, destinationFolder, answers);
    await buildPlugin(destinationFolder);

    addPluginDependencyToApp(rootDir, answers.id);
    addPluginToApp(rootDir, answers.id);

    console.log();
    console.log(
      chalk.green(
        `🥇  Successfully created ${chalk.cyan(
          `@spotify-backstage/plugin-${answers.id}`,
        )}`,
      ),
    );
    console.log();

    return destinationFolder;
  } catch (e) {
    console.log();
    console.log(`${chalk.red(e.message)}`);
    console.log();
    console.log(`🔥  ${chalk.red('Failed to create plugin!')}`);
    console.log();

    await cleanUp(rootDir, answers.id);
  }
};

export default createPlugin;
