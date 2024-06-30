/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { parseEntityRef } from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import type { JsonObject, JsonValue } from '@backstage/types';
import {
  parseRepoUrl,
  TemplateFilter,
  TemplateFilterMetadata,
} from '@backstage/plugin-scaffolder-node';
import get from 'lodash/get';
import { mapValues } from 'lodash';

export const createDefaultDocumentedFilters = ({
  integrations,
}: {
  integrations: ScmIntegrations;
}): Record<string, TemplateFilterMetadata & { impl: TemplateFilter }> => {
  return {
    parseRepoUrl: {
      description:
        'Parses a repository URL into its components, such as owner, repository name, and more.',
      schema: {
        input: {
          type: 'string',
          description: 'repo URL as collected from repository picker',
        },
        output: {
          type: 'object',
          title: '`RepoSpec`',
          required: ['repo', 'host'],
          properties: {
            repo: { type: 'string' },
            host: { type: 'string' },
            owner: { type: 'string' },
            organization: { type: 'string' },
            workspace: { type: 'string' },
            project: { type: 'string' },
          },
        },
      },
      examples: [
        {
          example: `- id: log
  name: Parse Repo URL
  action: debug:log
  input:
    extra: \${{ parameters.repoUrl | parseRepoUrl }}`,
          notes: ` - **Input**: \`github.com?repo=backstage&owner=backstage\`
 - **Output**: \`{"host":"github.com","owner":"backstage","repo":"backstage"}\`
`,
        },
      ],
      impl: url => parseRepoUrl(url as string, integrations),
    },
    parseEntityRef: {
      description:
        'Extracts the parts of an entity reference, such as the kind, namespace, and name.',
      schema: {
        input: {
          type: 'string',
          description: 'compact entity reference',
        },
        arguments: [
          {
            title: 'context',
            description: 'optional',
            type: 'object',
            properties: {
              defaultKind: {
                type: 'string',
                description:
                  'The default kind, if none is given in the reference',
              },
              defaultNamespace: {
                type: 'string',
                description:
                  'The default namespace, if none is given in the reference',
              },
            },
            oneOf: [
              { required: ['defaultKind'] },
              { required: ['defaultNamespace'] },
            ],
          },
        ],
        output: {
          type: 'object',
          title: '`CompoundEntityRef`',
          properties: {
            kind: { type: 'string' },
            namespace: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
      examples: [
        {
          description: 'Without context',
          example: `- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    extra: \${{ parameters.owner | parseEntityRef }}
`,
          notes: ` - **Input**: \`group:techdocs\`
- **Output**: \`{"kind": "group", "namespace": "default", "name": "techdocs"}\`
`,
        },
        {
          description: 'With context',
          example: `- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    extra: \${{ parameters.owner | parseEntityRef({ defaultKind:"group", defaultNamespace:"another-namespace" }) }}
`,
          notes: ` - **Input**: \`techdocs\`
 - **Arguments:**: \`[{ "defaultKind": "group", "defaultNamespace": "another-namespace" }]\`
 - **Output**: \`{"kind": "group", "namespace": "another-namespace", "name": "techdocs"}\`
`,
        },
      ],
      impl: (ref: JsonValue, context?: JsonValue) =>
        parseEntityRef(ref as string, context as JsonObject),
    },
    pick: {
      description:
        'Selects a specific property (kind, namespace, name) from an object.',
      schema: {
        arguments: [
          {
            type: 'string',
            title: 'Property',
          },
        ],
        output: {
          description: 'Selected property',
        },
      },
      examples: [
        {
          example: `- id: log
  name: Pick
  action: debug:log
  input:
    extra: \${{ parameters.owner | parseEntityRef | pick('name') }}`,
          notes: ` - **Input**: \`{ kind: 'Group', namespace: 'default', name: 'techdocs'\` }
- **Output**: \`techdocs\`
`,
        },
      ],
      impl: (obj: JsonValue, key: JsonValue) => get(obj, key as string),
    },
    projectSlug: {
      description: 'Generates a project slug from a repository URL.',
      schema: {
        input: {
          type: 'string',
          description: 'repo URL as collected from repository picker',
        },
        output: { type: 'string' },
      },
      examples: [
        {
          example: `- id: log
  name: Project Slug
  action: debug:log
  input:
    extra: \${{ parameters.repoUrl | projectSlug }}
`,
          notes: `- **Input**: \`github.com?repo=backstage&owner=backstage\`
- **Output**: backstage/backstage
`,
        },
      ],
      impl: repoUrl => {
        const { owner, repo } = parseRepoUrl(repoUrl as string, integrations);
        return `${owner}/${repo}`;
      },
    },
  };
};

export const createDefaultFilters = ({
  integrations,
}: {
  integrations: ScmIntegrations;
}): Record<string, TemplateFilter> => {
  return mapValues(createDefaultDocumentedFilters({ integrations }), 'impl');
};
