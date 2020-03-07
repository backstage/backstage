import chalk from 'chalk';
import { Command } from 'commander';
import { spawnSync } from 'child_process';

export default async (cmd: Command) => {
  const args = [
    '--outDir',
    'dist/cjs',
    '--noEmit',
    'false',
    '--module',
    'CommonJS',
  ];

  if (cmd.watch) {
    args.push('--watch');
  }

  try {
    const result = spawnSync('tsc', args, { stdio: 'inherit' });
    if (result.error) {
      throw result.error;
    }
    process.exit(result.status ?? 0);
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
