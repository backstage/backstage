import { resolvePackagePath } from '@backstage/backend-common';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { TypeSource } from '@graphql-tools/utils';
import { buildASTSchema, validateSchema } from 'graphql';
import { transformDirectives } from './mappers';

export function transformSchema(source: TypeSource) {
  const schema = transformDirectives(
    buildASTSchema(
      mergeTypeDefs([
        source,
        loadFilesSync(
          resolvePackagePath(
            '@frontside/backstage-plugin-graphql',
            'src/app/modules/**/*.graphql'
          )
        ),
      ])
    ),
  );
  const errors = validateSchema(schema);

  if (errors.length > 0) {
    throw new Error(errors.map(e => e.message).join('\n'));
  }
  return schema
}
