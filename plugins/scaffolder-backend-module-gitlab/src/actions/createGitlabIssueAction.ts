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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  TemplateExample,
  createTemplateAction,
} from '@backstage/plugin-scaffolder-node';
import * as yaml from 'yaml';
import {
  commonGitlabConfig,
  commonGitlabConfigExample,
} from '../commonGitlabConfig';
import { z } from 'zod';
import { checkEpicScope, convertDate, getClient, parseRepoUrl } from '../util';
import { Gitlab, CreateIssueOptions, IssueSchema } from '@gitbeaker/rest';

/**
 * Creates a `gitlab:issues:create` Scaffolder action.
 *
 * @param {} - Templating configuration.
 * @public
 */

export const createGitlabIssueAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction({
    id: 'gitlab:issues:create',
    description: 'Creates a Gitlab issue.',
    examples: getExamples(),
    schema: {
      input: commonGitlabConfig.merge(
        z.object({
          projectId: z.number({ description: 'Project Id' }),
          title: z.string({ description: 'Title of the issue' }),
          assignees: z
            .array(z.number(), {
              description: 'IDs of the users to assign the issue to.',
            })
            .optional(),
          confidential: z
            .boolean({ description: 'Issue Confidentiality' })
            .optional(),
          description: z
            .string({ description: 'Issue description' })
            .optional(),
          createdAt: z.string({ description: 'Creation date/time' }).optional(),
          dueDate: z.string({ description: 'Due date/time' }).optional(),
          discussionToResolve: z
            .string({
              description: 'Id of a discussion to resolve',
            })
            .optional(),
          epicId: z.number({ description: 'Id of the linked Epic' }).optional(),
          labels: z.string({ description: 'Labels to apply' }).optional(),
        }),
      ),
      output: z.object({
        issueUrl: z.string({ description: 'Issue Url' }),
        issueId: z.number({ description: 'Issue Id' }),
      }),
    },
    async handler(ctx) {
      try {
        const {
          repoUrl,
          projectId,
          title,
          description = '',
          confidential = false,
          assignees = [],
          createdAt = '',
          dueDate,
          discussionToResolve = '',
          epicId,
          labels = '',
          token,
        } = ctx.input;

        const { host } = parseRepoUrl(repoUrl, integrations);

        const api = getClient({ host, integrations, token });

        let isEpicScoped = false;

        if (epicId) {
          isEpicScoped = await checkEpicScope(
            api as any as InstanceType<typeof Gitlab>,
            projectId,
            epicId,
          );

          if (isEpicScoped) {
            ctx.logger.info('Epic is within Project Scope');
          } else {
            ctx.logger.warn(
              'Chosen epic is not within the Project Scope. The issue will be created without an associated epic.',
            );
          }
        }
        const mappedCreatedAt = convertDate(
          String(createdAt),
          new Date().toISOString(),
        );
        const mappedDueDate = dueDate
          ? convertDate(String(dueDate), new Date().toISOString())
          : undefined;

        const issueOptions: CreateIssueOptions = {
          description,
          assigneeIds: assignees,
          confidential,
          epicId: isEpicScoped ? epicId : undefined,
          labels,
          createdAt: mappedCreatedAt,
          dueDate: mappedDueDate,
          discussionToResolve,
        };

        const response = (await api.Issues.create(
          projectId,
          title,
          issueOptions,
        )) as IssueSchema;

        ctx.output('issueId', response.id);
        ctx.output('issueUrl', response.web_url);
      } catch (error: any) {
        throw new InputError(`Failed to create GitLab issue: ${error.message}`);
      }
    },
  });
};

function getExamples(): TemplateExample[] {
  return [
    {
      description: 'Create a GitLab issue with minimal options',
      example: yaml.stringify({
        steps: [
          {
            id: 'gitlabIssue',
            name: 'Issues',
            action: 'gitlab:issues:create',
            input: {
              ...commonGitlabConfigExample,
              projectId: '12',
              title: 'Test Issue',
              description: 'This is the description of the issue',
            },
          },
        ],
      }),
    },
    {
      description: 'Create a GitLab issue with assignees and date options',
      example: yaml.stringify({
        steps: [
          {
            id: 'gitlabIssue',
            name: 'Issues',
            action: 'gitlab:issues:create',
            input: {
              ...commonGitlabConfigExample,
              projectId: '12',
              title: 'Test Issue',
              assignees: '18',
              description: 'This is the description of the issue',
              createdAt: '2022-09-27 18:00:00.000',
              dueDate: '2022-09-28 12:00:00.000',
            },
          },
        ],
      }),
    },
    {
      description: 'Create a GitLab Issue with several options',
      example: yaml.stringify({
        steps: [
          {
            id: 'gitlabIssue',
            name: 'Issues',
            action: 'dxc:gitlab:issues:create',
            input: {
              ...commonGitlabConfigExample,
              projectId: '12',
              title: 'Test Issue',
              assignees: '18',
              description: 'This is the description of the issue',
              confidential: false,
              createdAt: '2022-09-27 18:00:00.000',
              dueDate: '2022-09-28 12:00:00.000',
              discussionToResolve: '1',
              epicId: '1',
              labels: 'test-label1,test-label2',
            },
          },
        ],
      }),
    },
  ];
}
