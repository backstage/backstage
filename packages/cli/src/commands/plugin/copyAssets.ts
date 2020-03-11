import chalk from 'chalk';
import fs from 'fs-extra';
import recursive from 'recursive-readdir';
import path from 'path';

const copyStaticAssets = async (source: string, destination: string) => {
  const assetFiles = await recursive(source, [
    '**/*.tsx',
    '**/*.ts',
    '**/*.js',
  ]);
  assetFiles.forEach(file => {
    const fileToBeCopied = file.replace(source, destination);
    const dirForFileToBeCopied = fileToBeCopied.replace(
      path.basename(fileToBeCopied),
      '',
    );
    fs.ensureDirSync(dirForFileToBeCopied);
    fs.copyFileSync(file, file.replace(source, destination));
  });
};

export default async () => {
  try {
    const pluginRoot = fs.realpathSync(process.cwd());
    const pluginSource = path.resolve(pluginRoot, 'src');
    const pluginDist = path.resolve(pluginRoot, 'dist', 'cjs');
    await copyStaticAssets(pluginSource, pluginDist);
    process.exit(0);
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
