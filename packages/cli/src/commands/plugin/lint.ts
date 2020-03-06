import chalk from 'chalk';
import { spawnSync } from 'child_process';

export default async () => {
  const args = ['lint'];

  try {
    spawnSync('web-scripts', args, { stdio: 'inherit' });
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
