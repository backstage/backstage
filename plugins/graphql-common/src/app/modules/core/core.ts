import { resolvePackagePath } from '@backstage/backend-common';
import { loadFilesSync } from '@graphql-tools/load-files';
import { createModule } from 'graphql-modules';
import type { ResolverContext } from '../../types';

export const Core = createModule({
  id: 'core',
  typeDefs: loadFilesSync(resolvePackagePath('@frontside/backstage-plugin-graphql', 'src/app/modules/core/core.graphql')),
  resolvers: {
    Node: {
      id: async ({ id }: { id: string }, _: never, { loader }: ResolverContext): Promise<string | null> => {
        const entity = await loader.load(id);
        if (!entity) return null;
        return id;
      },
    },
    Query: { node: (_: any, { id }: { id: string }): { id: string } => ({ id }) },
  },
});
