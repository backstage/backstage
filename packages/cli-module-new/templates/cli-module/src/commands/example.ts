import { cli } from 'cleye';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      help: info,
      booleanFlagNegation: true,
      flags: {
        name: {
          type: String,
          description: 'Your name',
        },
      },
    },
    undefined,
    args,
  );

  const name = flags.name ?? 'World';
  console.log(`Hello, ${name}!`);
};
