import program from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import createPluginCommand from './commands/createPlugin';
import watch from './commands/watch-deps';
import serve from './commands/serve';

process.on('unhandledRejection', err => {
  throw err;
});

const main = (argv: string[]) => {
  const version = fs
    .readFileSync('package.json', 'utf-8')
    .split('\n')
    .filter(row => row.match(/"version":/))
    .join()
    .match(/"version":\s"(?<version>\d\.\d\.\d)"/)?.groups?.version;

  program.name('backstage-cli').version(version ?? '0.0.0');

  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(createPluginCommand);

  program
    .command('serve')
    .description('Serves the dev/ folder of a package')
    .action(serve);

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
// main([process.argv[0], process.argv[1], 'create-plugin']);
