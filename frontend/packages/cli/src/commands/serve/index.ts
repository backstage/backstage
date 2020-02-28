import chalk from 'chalk';
import { startDevServer } from './server';

export default async () => {
  try {
    await startDevServer();
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
