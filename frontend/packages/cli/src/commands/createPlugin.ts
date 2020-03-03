import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';
import chalk from 'chalk';
import inquirer, { Answers, Question } from 'inquirer';
import recursive from 'recursive-readdir';

export const createPluginFolder = (rootDir: string, id: string): string => {
  const destination = path.join(rootDir, 'packages', 'plugins', id);

  if (fs.existsSync(destination)) {
    throw new Error(
      `A plugin with the same name already exists: ${chalk.cyan(
        destination.replace(rootDir, ''),
      )}\nPlease try again with a different plugin Id`,
    );
  }

  try {
    console.log(
      chalk.green(`Creating:\t${chalk.cyan(destination.replace(rootDir, ''))}`),
    );
    fs.mkdirSync(destination, { recursive: true });
    return destination;
  } catch (e) {
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
    console.log(
      chalk.green(`Creating:\t${chalk.cyan(path.basename(destination))}`),
    );
    fs.writeFileSync(destination, contents);
  } catch (e) {
    throw new Error(`Failed to create file: ${destination}: ${e.message}`);
  }
};

export const createFromTemplateDir = async (
  templateFolder: string,
  destinationFolder: string,
  answers: Answers,
) => {
  let files = [];
  try {
    files = await recursive(templateFolder);
  } catch (e) {
    throw new Error(`Failed to read files in template directory: ${e.message}`);
  }

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
      console.log(chalk.green(`Copying:\t${chalk.cyan(path.basename(file))}`));
      try {
        fs.copyFileSync(file, file.replace(templateFolder, destinationFolder));
      } catch (e) {
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

const createPlugin = async (): Promise<any> => {
  try {
    const currentDir = process.argv[1];
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
    const destinationFolder = createPluginFolder(
      path.join(currentDir, '..', '..', '..'),
      answers.id,
    );
    const templateFolder = path.join(
      currentDir,
      '..',
      '..',
      '@spotify-backstage',
      'cli',
      'templates',
      'default-plugin',
    );

    await createFromTemplateDir(templateFolder, destinationFolder, answers);

    console.log();
    console.log(
      chalk.green(
        `Successfully created a Backstage Plugin in ${chalk.cyan(
          path.join('packages', 'plugins', answers.id),
        )}`,
      ),
    );

    console.log(
      chalk.green(
        `Run ${chalk.cyan('yarn start')} in the plugin directory to start it.`,
      ),
    );
    console.log();

    return destinationFolder;
  } catch (e) {
    console.log();
    console.log(e.message);
    console.log();
  }
};

export default createPlugin;
