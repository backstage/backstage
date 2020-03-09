import chalk from 'chalk';
import { Command } from 'commander';
import { spawnSync } from 'child_process';

export default async (cmd: Command) => {
  const args = ['test'];

  if (cmd.watch) {
    args.push('--watch');
  }
  if (cmd.coverage) {
    args.push('--coverage');
  }

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
