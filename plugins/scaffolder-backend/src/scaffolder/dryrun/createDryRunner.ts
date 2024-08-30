/*
 * Copyright 2022 The Backstage Authors
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

import {
  AuditorService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';
import type { UserEntity } from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { TaskSpec, TemplateInfo } from '@backstage/plugin-scaffolder-common';
import {
  createTemplateAction,
  deserializeDirectoryContents,
  SerializedFile,
  serializeDirectoryContents,
  TaskSecrets,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { TemplateActionRegistry } from '../actions';
import { NunjucksWorkflowRunner } from '../tasks/NunjucksWorkflowRunner';
import { DecoratedActionsRegistry } from './DecoratedActionsRegistry';

interface DryRunInput {
  spec: TaskSpec;
  templateInfo: TemplateInfo;
  secrets?: TaskSecrets;
  directoryContents: SerializedFile[];
  credentials: BackstageCredentials;
  user?: {
    entity?: UserEntity;
    ref?: string;
  };
}

interface DryRunResult {
  log: Array<{ body: JsonObject }>;
  directoryContents: SerializedFile[];
  output: JsonObject;
}

/** @internal */
export type TemplateTesterCreateOptions = {
  logger: Logger;
  auditor?: AuditorService;
  integrations: ScmIntegrations;
  actionRegistry: TemplateActionRegistry;
  workingDirectory: string;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
  permissions?: PermissionEvaluator;
};

/**
 * Executes a dry-run of the provided template.
 *
 * The provided content will be extracted into a temporary directory
 * which is then use as the base for any relative file fetch paths.
 *
 * @internal
 */
export function createDryRunner(options: TemplateTesterCreateOptions) {
  return async function dryRun(input: DryRunInput): Promise<DryRunResult> {
    let contentPromise;

    const workflowRunner = new NunjucksWorkflowRunner({
      ...options,
      actionRegistry: new DecoratedActionsRegistry(options.actionRegistry, [
        createTemplateAction({
          id: 'dry-run:extract',
          supportsDryRun: true,
          async handler(ctx) {
            contentPromise = serializeDirectoryContents(ctx.workspacePath);
            await contentPromise.catch(() => {});
          },
        }),
      ]),
    });

    // Extracting contentsPath and dryRunId from the baseUrl
    const baseUrl = input.templateInfo.baseUrl;
    if (!baseUrl) {
      throw new Error('baseUrl is required');
    }
    const basePath = fileURLToPath(new URL(baseUrl));
    const contentsPath = path.dirname(basePath);
    const dryRunId = uuid();

    const log = new Array<{ body: JsonObject }>();

    try {
      await deserializeDirectoryContents(contentsPath, input.directoryContents);

      const abortSignal = new AbortController().signal;
      const result = await workflowRunner.execute({
        taskId: dryRunId,
        spec: {
          ...input.spec,
          steps: [
            ...input.spec.steps,
            {
              id: dryRunId,
              name: 'dry-run:extract',
              action: 'dry-run:extract',
            },
          ],
          templateInfo: input.templateInfo,
        },
        secrets: input.secrets,
        getInitiatorCredentials: () => Promise.resolve(input.credentials),
        // No need to update this at the end of the run, so just hard-code it
        done: false,
        isDryRun: true,
        getWorkspaceName: async () => `dry-run-${dryRunId}`,
        cancelSignal: abortSignal,
        async emitLog(message: string, logMetadata?: JsonObject) {
          if (logMetadata?.stepId === dryRunId) {
            return;
          }
          log.push({
            body: {
              ...logMetadata,
              message,
            },
          });
        },
        complete: async () => {
          throw new Error('Not implemented');
        },
      });

      if (!contentPromise) {
        throw new Error('Content extraction step was skipped');
      }
      const directoryContents = await contentPromise;

      return {
        log,
        directoryContents,
        output: result.output,
      };
    } finally {
      await fs.remove(contentsPath);
    }
  };
}
