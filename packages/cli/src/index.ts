import program from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import createPluginCommand from './commands/createPlugin';
import watch from './commands/watch-deps';
import pluginBuild from './commands/plugin/build';
import pluginLint from './commands/plugin/lint';
import pluginServe from './commands/plugin/serve';
import pluginTest from './commands/plugin/test';

process.on('unhandledRejection', err => {
  throw err;
});

const main = (argv: string[]) => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  program.name('backstage-cli').version(packageJson.version ?? '0.0.0');

  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(createPluginCommand);

  program
    .command('plugin:build')
    .option('--watch', 'Enable watch mode')
    .description('Build a plugin')
    .action(pluginBuild);

  program
    .command('plugin:lint')
    .description('Lint a plugin')
    .action(pluginLint);

  program
    .command('plugin:serve')
    .description('Serves the dev/ folder of a plugin')
    .action(pluginServe);

  program
    .command('plugin:test')
    .option('--watch', 'Enable watch mode')
    .description('Run all tests for a plugin')
    .action(pluginTest);

  program
    .command('watch-deps')
    .description('Watch all dependencies while running another command')
    .action(watch);

  program.on('command:*', () => {
    console.log();
    console.log(
      chalk.red(`Invalid command: ${chalk.cyan(program.args.join(' '))}`),
    );
    console.log(chalk.red('See --help for a list of available commands.'));
    console.log();
    process.exit(1);
  });

  if (!process.argv.slice(2).length) {
    program.outputHelp(chalk.yellow);
  }

  program.parse(argv);
};

main(process.argv);
// main([process.argv[0], process.argv[1], '--version']);
