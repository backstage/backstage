import program from 'commander';
import createPluginCommand from './commands/createPlugin';
import watch from './commands/watch-deps';
import serve from './commands/serve';

process.on('unhandledRejection', err => {
  throw err;
});

const main = (argv: string[]) => {
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
    console.error(
      'Invalid command: %s\nSee --help for a list of available commands.',
      program.args.join(' '),
    );
    process.exit(1);
  });

  program.parse(argv);
};

main(process.argv);
// main([process.argv[0], process.argv[1], 'create-plugin']);
