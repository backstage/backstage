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
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import commonGitlabConfig, {
  IssueStateEvent,
  IssueType,
} from '../commonGitlabConfig';
import { examples } from './gitlabIssueEdit.examples';
import { z } from 'zod';
import { checkEpicScope, convertDate, getClient, parseRepoUrl } from '../util';
import { EditIssueOptions, IssueSchema } from '@gitbeaker/rest';
import { getErrorMessage } from './helpers';

const editIssueInputProperties = z.object({
  projectId: z
    .number()
    .describe(
      'The global ID or URL-encoded path of the project owned by the authenticated user.',
    ),
  issueIid: z.number().describe("The internal ID of a project's issue"),
  addLabels: z
    .string({
      description:
        'Comma-separated label names to add to an issue. If a label does not already exist, this creates a new project label and assigns it to the issue.',
    })
    .optional(),
  assignees: z
    .array(z.number(), {
      description: 'IDs of the users to assign the issue to.',
    })
    .optional(),
  confidential: z
    .boolean({ description: 'Updates an issue to be confidential.' })
    .optional(),
  description: z
    .string()
    .describe('The description of an issue. Limited to 1,048,576 characters.')
    .max(1048576)
    .optional(),
  discussionLocked: z
    .boolean({
      description:
        'Flag indicating if the issue’s discussion is locked. If the discussion is locked only project members can add or edit comments.',
    })
    .optional(),
  dueDate: z
    .string()
    .describe(
      'The due date. Date time string in the format YYYY-MM-DD, for example 2016-03-11.',
    )
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD')
    .optional(),
  epicId: z
    .number({
      description:
        'ID of the epic to add the issue to. Valid values are greater than or equal to 0.',
    })
    .min(0, 'Valid values should be equal or greater than zero')
    .optional(),
  issueType: z
    .nativeEnum(IssueType, {
      description:
        'Updates the type of issue. One of issue, incident, test_case or task.',
    })
    .optional(),
  labels: z
    .string({
      description:
        'Comma-separated label names for an issue. Set to an empty string to unassign all labels. If a label does not already exist, this creates a new project label and assigns it to the issue.',
    })
    .optional(),
  milestoneId: z
    .number({
      description:
        'The global ID of a milestone to assign the issue to. Set to 0 or provide an empty value to unassign a milestone',
    })
    .optional(),
  removeLabels: z
    .string({
      description: 'Comma-separated label names to remove from an issue.',
    })
    .optional(),
  stateEvent: z
    .nativeEnum(IssueStateEvent, {
      description:
        'The state event of an issue. To close the issue, use close, and to reopen it, use reopen.',
    })
    .optional(),
  title: z.string().describe('The title of an issue.').optional(),
  updatedAt: z
    .string()
    .describe(
      'When the issue was updated. Date time string, ISO 8601 formatted',
    )
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/,
      'Invalid date format. Use YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss.SSSZ',
    )
    .optional(),
  weight: z
    .number({ description: 'The issue weight' })
    .min(0, 'Valid values should be equal or greater than zero')
    .max(10, 'Valid values should be equal or less than 10')
    .optional(),
});

const editIssueOutputProperties = z.object({
  issueUrl: z.string({ description: 'Issue WebUrl' }),
  projectId: z.number({
    description: 'The project id the issue belongs to WebUrl',
  }),
  issueId: z.number({ description: 'The issues Id' }),
  issueIid: z.number({
    description: "The issues internal ID of a project's issue",
  }),
  state: z.string({ description: 'The state event of an issue' }),
  title: z.string({ description: 'The title of an issue.' }),
  updatedAt: z.string({ description: 'The last updated time of the issue.' }),
});

/**
 * Creates a `gitlab:issue:edit` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const editGitlabIssueAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction({
    id: 'gitlab:issue:edit',
    description: 'Edit a Gitlab issue.',
    examples,
    schema: {
      input: commonGitlabConfig.merge(editIssueInputProperties),
      output: editIssueOutputProperties,
    },
    async handler(ctx) {
      try {
        const {
          repoUrl,
          projectId,
          title,
          addLabels,
          removeLabels,
          issueIid,
          description,
          confidential = false,
          assignees = [],
          updatedAt = '',
          dueDate,
          discussionLocked = false,
          epicId,
          labels,
          issueType,
          milestoneId,
          stateEvent,
          weight,
          token,
        } = commonGitlabConfig.merge(editIssueInputProperties).parse(ctx.input);

        const { host } = parseRepoUrl(repoUrl, integrations);
        const api = getClient({ host, integrations, token });

        let isEpicScoped = false;

        isEpicScoped = await ctx.checkpoint({
          key: `issue.edit.is.scoped.${projectId}.${epicId}`,
          fn: async () => {
            if (epicId) {
              const scoped = await checkEpicScope(api, projectId, epicId);

              if (scoped) {
                ctx.logger.info('Epic is within Project Scope');
              } else {
                ctx.logger.warn(
                  'Chosen epic is not within the Project Scope. The issue will be created without an associated epic.',
                );
              }
              return scoped;
            }
            return false;
          },
        });

        const mappedUpdatedAt = convertDate(
          String(updatedAt),
          new Date().toISOString(),
        );

        const editIssueOptions: EditIssueOptions = {
          addLabels,
          assigneeIds: assignees,
          confidential,
          description,
          discussionLocked,
          dueDate,
          epicId: isEpicScoped ? epicId : undefined,
          issueType,
          labels,
          milestoneId,
          removeLabels,
          stateEvent,
          title,
          updatedAt: mappedUpdatedAt,
          weight,
        };

        const editedIssue = await ctx.checkpoint({
          key: `issue.edit.${projectId}.${issueIid}`,
          fn: async () => {
            const response = (await api.Issues.edit(
              projectId,
              issueIid,
              editIssueOptions,
            )) as IssueSchema;

            return {
              issueId: response.id,
              issueUrl: response.web_url,
              projectId: response.project_id,
              issueIid: response.iid,
              title: response.title,
              state: response.state,
              updatedAt: response.updated_at,
            };
          },
        });

        ctx.output('issueId', editedIssue.issueId);
        ctx.output('projectId', editedIssue.projectId);
        ctx.output('issueUrl', editedIssue.issueUrl);
        ctx.output('issueIid', editedIssue.issueIid);
        ctx.output('title', editedIssue.title);
        ctx.output('state', editedIssue.state);
        ctx.output('updatedAt', editedIssue.updatedAt);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          // Handling Zod validation errors
          throw new InputError(`Validation error: ${error.message}`, {
            validationErrors: error.errors,
          });
        }
        // Handling other errors
        throw new InputError(
          `Failed to edit/modify GitLab issue: ${getErrorMessage(error)}`,
        );
      }
    },
  });
};
