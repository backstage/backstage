/*
 * Copyright 2026 The Backstage Authors
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

/**
 * A curated set of scaffolder actions the LLM is allowed to use as steps.
 *
 * In v1 this is a static list so the plugin works standalone — without
 * having to wire into another plugin's runtime action registry. A future
 * revision should source this from the actual `ActionsRegistry` so the
 * model only ever sees actions that the host backend has loaded.
 *
 * @public
 */
export interface WellKnownAction {
  id: string;
  description: string;
  /** Free-text sketch of the input shape — not a binding schema. */
  inputs: string;
}

/**
 * @public
 */
export const WELL_KNOWN_ACTIONS: WellKnownAction[] = [
  {
    id: 'fetch:template',
    description:
      'Copy a templated skeleton directory into the workspace, running nunjucks substitution over its files.',
    inputs:
      '{ url: string, targetPath?: string, values?: object, copyWithoutTemplating?: string[] }',
  },
  {
    id: 'fetch:plain',
    description:
      'Copy a plain (non-templated) directory or file into the workspace.',
    inputs: '{ url: string, targetPath?: string }',
  },
  {
    id: 'publish:github',
    description:
      'Create a new GitHub repository and push the workspace contents to it.',
    inputs:
      '{ repoUrl: string, description?: string, defaultBranch?: string, gitCommitMessage?: string, repoVisibility?: "public"|"private"|"internal" }',
  },
  {
    id: 'publish:gitlab',
    description:
      'Create a new GitLab project and push the workspace contents to it.',
    inputs:
      '{ repoUrl: string, defaultBranch?: string, repoVisibility?: "public"|"private"|"internal" }',
  },
  {
    id: 'publish:github:pull-request',
    description:
      'Open a pull request against an existing GitHub repository using the workspace as the source branch.',
    inputs:
      '{ repoUrl: string, branchName: string, title: string, description?: string, targetBranchName?: string }',
  },
  {
    id: 'publish:gitlab:merge-request',
    description: 'Open a merge request against an existing GitLab project.',
    inputs:
      '{ repoUrl: string, branchName: string, title: string, description?: string, targetBranchName?: string }',
  },
  {
    id: 'catalog:register',
    description:
      'Register the workspace catalog-info.yaml with the Backstage catalog after publishing.',
    inputs:
      '{ repoContentsUrl: string, catalogInfoPath?: string, optional?: boolean }',
  },
  {
    id: 'catalog:fetch',
    description: 'Fetch one or more catalog entities by entity reference.',
    inputs: '{ entityRef: string } | { entityRefs: string[] }',
  },
  {
    id: 'debug:log',
    description:
      'Log a message during template execution. Useful for diagnostics.',
    inputs: '{ message: string }',
  },
  {
    id: 'filesystem:rename',
    description: 'Rename files within the workspace.',
    inputs: '{ files: Array<{ from: string, to: string }> }',
  },
  {
    id: 'filesystem:delete',
    description: 'Delete files from the workspace.',
    inputs: '{ files: string[] }',
  },
  {
    id: 'mcp:call',
    description:
      'Invoke a tool on a configured MCP server. Requires plugin-scaffolder-backend-module-mcp.',
    inputs:
      '{ server: string, tool: string, arguments?: Record<string, unknown> }',
  },
];

/**
 * Formats the action catalog for inclusion in the LLM system prompt.
 * @public
 */
export function formatActionsForPrompt(
  actions: WellKnownAction[] = WELL_KNOWN_ACTIONS,
): string {
  return actions
    .map(a => `- \`${a.id}\` — ${a.description}\n  inputs: ${a.inputs}`)
    .join('\n');
}
