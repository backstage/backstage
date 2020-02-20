import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import inquirer from 'inquirer';

export const createPluginFolder = (rootDir: string, id: string): string => {
  const destination = path.join(rootDir, 'packages', 'plugins', id);

  if (fs.existsSync(destination)) {
    throw new Error(
      `A plugin with the same name already exists: ${destination}`,
    );
  }

  try {
    fs.mkdirSync(destination, { recursive: true });
    return destination;
  } catch (e) {
    throw new Error(
      `Failed to create plugin directory: ${destination}: ${e.message}`,
    );
  }
};

export const createFileFromTemplate = (
  sourcePath: string,
  destinationPath: string,
  answers: { [key: string]: string },
) => {
  const template = fs.readFileSync(sourcePath);
  const compiled = handlebars.compile(template.toString());
  const contents = compiled({
    name: path.basename(destinationPath),
    ...answers,
  });
  try {
    fs.writeFileSync(destinationPath, contents);
  } catch (e) {
    throw new Error(`Failed to create file: ${destinationPath}: ${e.message}`);
  }
};

const createPlugin = async (): Promise<any> => {
  const currentDir = process.argv[1];
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an ID for the plugin [required]',
      validate: (value: any) =>
        value ? true : 'Please enter an ID for the plugin',
    },
  ];

  const answers: { [key: string]: string } = await inquirer.prompt(questions);
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
  const files = [{ input: 'package.json.hbs', output: 'package.json' }];

  files.forEach(file => {
    createFileFromTemplate(
      path.join(templateFolder, file.input),
      path.join(destinationFolder, file.output),
      answers,
    );
  });

  return destinationFolder;
};

export default createPlugin;
