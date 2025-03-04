/*
 * Copyright 2021 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { isChildPath } from '@backstage/backend-plugin-api';
import { join as joinPath, normalize as normalizePath } from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { TemplateActionOptions } from './createTemplateAction';
import zodToJsonSchema from 'zod-to-json-schema';
import { z } from 'zod';
import { Schema } from 'jsonschema';

/**
 * @public
 */
export const getRepoSourceDirectory = (
  workspacePath: string,
  sourcePath: string | undefined,
) => {
  if (sourcePath) {
    const safeSuffix = normalizePath(sourcePath).replace(
      /^(\.\.(\/|\\|$))+/,
      '',
    );
    const path = joinPath(workspacePath, safeSuffix);
    if (!isChildPath(workspacePath, path)) {
      throw new Error('Invalid source path');
    }
    return path;
  }
  return workspacePath;
};

/**
 * @public
 */
export const parseRepoUrl = (
  repoUrl: string,
  integrations: ScmIntegrationRegistry,
): {
  repo: string;
  host: string;
  owner?: string;
  organization?: string;
  workspace?: string;
  project?: string;
} => {
  let parsed;
  try {
    parsed = new URL(`https://${repoUrl}`);
  } catch (error) {
    throw new InputError(
      `Invalid repo URL passed to publisher, got ${repoUrl}, ${error}`,
    );
  }
  const host = parsed.host;
  const owner = parsed.searchParams.get('owner') ?? undefined;
  const organization = parsed.searchParams.get('organization') ?? undefined;
  const workspace = parsed.searchParams.get('workspace') ?? undefined;
  const project = parsed.searchParams.get('project') ?? undefined;

  const type = integrations.byHost(host)?.type;

  if (!type) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  const repo: string = parsed.searchParams.get('repo')!;
  switch (type) {
    case 'bitbucket': {
      if (host === 'www.bitbucket.org') {
        checkRequiredParams(parsed, 'workspace');
      }
      checkRequiredParams(parsed, 'project', 'repo');
      break;
    }
    case 'azure': {
      checkRequiredParams(parsed, 'project', 'repo');
      break;
    }
    case 'gitlab': {
      // project is the projectID, and if defined, owner and repo won't be needed.
      if (!project) {
        checkRequiredParams(parsed, 'owner', 'repo');
      }
      break;
    }
    case 'gitea': {
      checkRequiredParams(parsed, 'repo');
      break;
    }
    case 'gerrit': {
      checkRequiredParams(parsed, 'repo');
      break;
    }
    default: {
      checkRequiredParams(parsed, 'repo', 'owner');
      break;
    }
  }

  return { host, owner, repo, organization, workspace, project };
};

function checkRequiredParams(repoUrl: URL, ...params: string[]) {
  for (let i = 0; i < params.length; i++) {
    if (!repoUrl.searchParams.get(params[i])) {
      throw new InputError(
        `Invalid repo URL passed to publisher: ${repoUrl.toString()}, missing ${
          params[i]
        }`,
      );
    }
  }
}

const isZodSchema = (schema: unknown): schema is z.ZodType => {
  return typeof schema === 'object' && !!schema && 'safeParseAsync' in schema;
};

const isNativeZodSchema = (
  schema: unknown,
): schema is { [key in string]: (zImpl: typeof z) => z.ZodType } => {
  return (
    typeof schema === 'object' &&
    !!schema &&
    Object.values(schema).every(v => typeof v === 'function')
  );
};

export const parseSchemas = (
  action: TemplateActionOptions,
): { inputSchema?: Schema; outputSchema?: Schema } => {
  if (!action.schema) {
    return { inputSchema: undefined, outputSchema: undefined };
  }

  if (isZodSchema(action.schema.input)) {
    return {
      inputSchema: zodToJsonSchema(action.schema.input) as Schema,
      outputSchema: isZodSchema(action.schema.output)
        ? (zodToJsonSchema(action.schema.output) as Schema)
        : undefined,
    };
  }

  if (isNativeZodSchema(action.schema.input)) {
    const input = z.object(
      Object.fromEntries(
        Object.entries(action.schema.input).map(([k, v]) => [k, v(z)]),
      ),
    );

    return {
      inputSchema: zodToJsonSchema(input) as Schema,
      outputSchema: isNativeZodSchema(action.schema.output)
        ? (zodToJsonSchema(
            z.object(
              Object.fromEntries(
                Object.entries(action.schema.output).map(([k, v]) => [k, v(z)]),
              ),
            ),
          ) as Schema)
        : undefined,
    };
  }

  return {
    inputSchema: action.schema.input,
    outputSchema: action.schema.output,
  };
};
