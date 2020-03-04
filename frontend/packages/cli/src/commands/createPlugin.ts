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

  try {
    fs.mkdirSync(destination, { recursive: true });
    console.log(
      chalk.green(
        `  created:\t ✓ ${chalk.cyan(destination.replace(rootDir, ''))}`,
      ),
    );
    return destination;
  } catch (e) {
    console.log(
      chalk.red(
        `  failed:\t ✗ ${chalk.cyan(destination.replace(rootDir, ''))}`,
      ),
    );
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
    console.log(
      chalk.green(`  created:\t ✓ ${chalk.cyan(path.basename(destination))}`),
    );
  } catch (e) {
    console.log(
      chalk.red(`  failed:\t ✗ ${chalk.cyan(path.basename(destination))}`),
    );
    throw new Error(`Failed to create file: ${destination}: ${e.message}`);
  }
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
      chalk.green(`  read:\t\t ✓ ${chalk.cyan(`${files.length} files`)}`),
    );
  } catch (e) {
    console.log(chalk.red(`  failed:\t ✗ 0 files`));
    throw new Error(`Failed to read files in template directory: ${e.message}`);
  }

  console.log();
  console.log(chalk.green(' Setting up the plugin files:'));
  files.forEach(file => {
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
        console.log(
          chalk.green(`  copied:\t ✓ ${chalk.cyan(path.basename(file))}`),
        );
      } catch (e) {
        console.log(
          chalk.red(`  failed:\t ✗ ${chalk.cyan(path.basename(file))}`),
        );
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
    try {
      // Not using recursion here, so only empty directories can be removed
      fs.rmdirSync(destination);
      console.log();
      console.log(
        chalk.green(
          `🧹  Removing ${chalk.cyan(destination.replace(rootDir, ''))}`,
        ),
      );
      console.log();
    } catch (e) {
      console.log();
      console.log(chalk.red(`Failed to cleanup: ${e.message}`));
      console.log();
    }
  }
};

const buildPlugin = async (pluginFolder: string) => {
  console.log();
  console.log(chalk.green(` Building the plugin:`));

  const prom_exec = promisify(exec);

  // const commands = ['yarn', 'yarn build'];
  const commands = ['yarn'];
  for (const command of commands) {
    try {
      process.chdir(pluginFolder);
      await prom_exec(command, { timeout: 60000 });
      console.log(chalk.green(`  executed:\t ✓ ${chalk.cyan(command)}`));
    } catch (e) {
      console.log(chalk.red(`  failed:\t ✗ ${chalk.cyan(command)}`));
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
