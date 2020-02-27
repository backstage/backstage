import program from 'commander';
import createPluginCommand from './commands/createPlugin';
import servePlugin from './commands/servePlugin';

process.on('unhandledRejection', err => {
  throw err;
});

const main = (argv: string[]) => {
  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(createPluginCommand);

  program
    .command('serve-plugin')
    .description('Serves a plugin dev folder')
    .action(servePlugin);

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
