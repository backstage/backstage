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
/* We want to maintain the same information as an enum, so we disable the redeclaration warning */
/* eslint-disable @typescript-eslint/no-redeclare */

import { z } from 'zod/v3';

const commonGitlabConfig = z.object({
  repoUrl: z.string({ description: 'Repository Location' }),
  token: z
    .string({ description: 'The token to use for authorization to GitLab' })
    .optional(),
});

export default commonGitlabConfig;

export const commonGitlabConfigExample = {
  repoUrl: 'gitlab.com?owner=namespace-or-owner&repo=project-name',
  token: '${{ secrets.USER_OAUTH_TOKEN }}',
};

/**
 * Gitlab issue types as specified by gitlab api
 *
 * @public
 */
export const IssueType = {
  ISSUE: 'issue',
  INCIDENT: 'incident',
  TEST: 'test_case',
  TASK: 'task',
} as const;

/**
 * @public
 */
export type IssueType = (typeof IssueType)[keyof typeof IssueType];

/**
 * @public
 */
export namespace IssueType {
  export type ISSUE = typeof IssueType.ISSUE;
  export type INCIDENT = typeof IssueType.INCIDENT;
  export type TEST = typeof IssueType.TEST;
  export type TASK = typeof IssueType.TASK;
}

/**
 * Gitlab issue state events for modifications
 *
 * @public
 */
export const IssueStateEvent = {
  CLOSE: 'close',
  REOPEN: 'reopen',
} as const;

/**
 * @public
 */
export type IssueStateEvent =
  (typeof IssueStateEvent)[keyof typeof IssueStateEvent];

/**
 * @public
 */
export namespace IssueStateEvent {
  export type CLOSE = typeof IssueStateEvent.CLOSE;
  export type REOPEN = typeof IssueStateEvent.REOPEN;
}
