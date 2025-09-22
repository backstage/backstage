/*
 * Copyright 2025 The Backstage Authors
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
import { ScmIntegrations } from '@backstage/integration';
import { parseRepoUrl } from '@backstage/plugin-scaffolder-node';
import { createTemplateFilter } from '@backstage/plugin-scaffolder-node/alpha';
import { examples } from './examples';

export const createProjectSlug = (integrations: ScmIntegrations) =>
  createTemplateFilter({
    id: 'projectSlug',
    description: 'Generates a project slug from a repository URL.',
    schema: z =>
      z
        .function()
        .args(
          z.string().describe('repo URL as collected from repository picker'),
        )
        .returns(z.string()),
    examples,
    filter: repoUrl => {
      const { owner, repo } = parseRepoUrl(repoUrl, integrations);
      return `${owner}/${repo}`;
    },
  });
