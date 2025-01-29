import { Command, Option } from 'commander';
import { lazy } from '../../lib/lazy';

export function registerRepoCommands(command: Command) {
  command
    .command('build')
    .description(
      'Build packages in the project, excluding bundled app and backend packages.',
    )
    .option(
      '--all',
      'Build all packages, including bundled app and backend packages.',
    )
    .option(
      '--since <ref>',
      'Only build packages and their dev dependents that changed since the specified ref',
    )
    .option(
      '--minify',
      'Minify the generated code. Does not apply to app package (app is minified by default).',
    )
    .action(lazy(() => import('./commands/repo/build'), 'command'));
}

export function registerPackageCommands(command: Command) {
  command
    .command('build')
    .description('Build a package for production deployment or publishing')
    .option('--role <name>', 'Run the command with an explicit package role')
    .option(
      '--minify',
      'Minify the generated code. Does not apply to app package (app is minified by default).',
    )
    .option(
      '--skip-build-dependencies',
      'Skip the automatic building of local dependencies. Applies to backend packages only.',
    )
    .option(
      '--stats',
      'If bundle stats are available, write them to the output directory. Applies to app packages only.',
    )
    .option(
      '--config <path>',
      'Config files to load instead of app-config.yaml. Applies to app packages only.',
      (opt: string, opts: string[]) => (opts ? [...opts, opt] : [opt]),
      Array<string>(),
    )
    .action(lazy(() => import('./commands/package/build'), 'command'));
}

export function registerCommands(program: Command) {
  program
    .command('build-workspace <workspace-dir> [packages...]')
    .addOption(
      new Option(
        '--alwaysYarnPack',
        'Alias for --alwaysPack for backwards compatibility.',
      )
        .implies({ alwaysPack: true })
        .hideHelp(true),
    )
    .option(
      '--alwaysPack',
      'Force workspace output to be a result of running `yarn pack` on each package (warning: very slow)',
    )
    .description('Builds a temporary dist workspace from the provided packages')
    .action(lazy(() => import('./commands/buildWorkspace'), 'default'));
}
