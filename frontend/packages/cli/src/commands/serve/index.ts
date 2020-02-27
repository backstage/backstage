import chalk from 'chalk';
import { startDevServer } from './server';

export default async () => {
  try {
    await startDevServer();
  } catch (error) {
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};
