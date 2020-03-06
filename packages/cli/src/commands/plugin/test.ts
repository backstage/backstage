import chalk from 'chalk';
import { Command } from 'commander';
import { spawnSync } from 'child_process';

export default async (cmd: Command) => {
  const args = ['test'];

  if (cmd.watch) {
    args.push('--watch');
  }

  try {
    spawnSync('web-scripts', args, { stdio: 'inherit' });
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
