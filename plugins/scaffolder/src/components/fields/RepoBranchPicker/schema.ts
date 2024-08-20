/*
 * Copyright 2024 The Backstage Authors
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
export const RepoBranchPickerFieldSchema = makeFieldSchemaFromZod(
  z.string(),
  z.object({
    requestUserCredentials: z
      .object({
        secretsKey: z
          .string()
          .describe(
            'Key used within the template secrets context to store the credential',
          ),
        additionalScopes: z
          .object({
            gitea: z
              .array(z.string())
              .optional()
              .describe('Additional Gitea scopes to request'),
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
 * `RepoBranchPicker` field extension.
 *
 * @public
 */
export type RepoBranchPickerUiOptions =
  typeof RepoBranchPickerFieldSchema.uiOptionsType;

export type RepoBranchPickerProps = typeof RepoBranchPickerFieldSchema.type;

// This has been duplicated from /plugins/scaffolder/src/components/fields/RepoUrlPicker/schema.ts
// NOTE: There is a bug with this failing validation in the custom field explorer due
// to https://github.com/rjsf-team/react-jsonschema-form/issues/675 even if
// requestUserCredentials is not defined
export const RepoBranchPickerSchema = RepoBranchPickerFieldSchema.schema;
