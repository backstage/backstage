import chalk from 'chalk';
import { spawnSync } from 'child_process';

export default async () => {
  const args = ['lint'];

  try {
    const result = spawnSync('web-scripts', args, { stdio: 'inherit' });
    if (result.error) {
      throw result.error;
    }
    process.exit(result.status ?? 0);
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
