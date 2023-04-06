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
import { z } from 'zod';
import { makeFieldSchemaFromZod } from '../utils';

/**
 * @public
 */
export const RepoUrlPickerFieldSchema = makeFieldSchemaFromZod(
  z.string(),
  z.object({
    allowedHosts: z
      .array(z.string())
      .optional()
      .describe('List of allowed SCM platform hosts'),
    allowedOrganizations: z
      .array(z.string())
      .optional()
      .describe('List of allowed organizations in the given SCM platform'),
    allowedOwners: z
      .array(z.string())
      .optional()
      .describe('List of allowed owners in the given SCM platform'),
    allowedProjects: z
      .array(z.string())
      .optional()
      .describe('List of allowed projects in the given SCM platform'),
    allowedRepos: z
      .array(z.string())
      .optional()
      .describe('List of allowed repos in the given SCM platform'),
    requestUserCredentials: z
      .object({
        secretsKey: z
          .string()
          .describe(
            'Key used within the template secrets context to store the credential',
          ),
        additionalScopes: z
          .object({
            gerrit: z
              .array(z.string())
              .optional()
              .describe('Additional Gerrit scopes to request'),
            github: z
              .array(z.string())
              .optional()
              .describe('Additional GitHub scopes to request'),
            gitlab: z
              .array(z.string())
              .optional()
              .describe('Additional GitLab scopes to request'),
            bitbucket: z
              .array(z.string())
              .optional()
              .describe('Additional BitBucket scopes to request'),
            azure: z
              .array(z.string())
              .optional()
              .describe('Additional Azure scopes to request'),
          })
          .optional()
          .describe('Additional permission scopes to request'),
      })
      .optional()
      .describe(
        'If defined will request user credentials to auth against the given SCM platform',
      ),
  }),
);

/**
 * The input props that can be specified under `ui:options` for the
 * `RepoUrlPicker` field extension.
 *
 * @public
 */
export type RepoUrlPickerUiOptions =
  typeof RepoUrlPickerFieldSchema.uiOptionsType;

export type RepoUrlPickerProps = typeof RepoUrlPickerFieldSchema.type;

// NOTE: There is a bug with this failing validation in the custom field explorer due
// to https://github.com/rjsf-team/react-jsonschema-form/issues/675 even if
// requestUserCredentials is not defined
export const RepoUrlPickerSchema = RepoUrlPickerFieldSchema.schema;
