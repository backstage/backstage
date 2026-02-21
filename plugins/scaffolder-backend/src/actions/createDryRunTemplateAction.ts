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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import {
  TemplateEntityV1beta3,
  ScaffolderClient,
} from '@backstage/plugin-scaffolder-common';
import { ForwardedError } from '@backstage/errors';
import yaml from 'yaml';

export const createDryRunTemplateAction = ({
  actionsRegistry,
  scaffolderClient,
}: {
  actionsRegistry: ActionsRegistryService;
  scaffolderClient: ScaffolderClient;
}) => {
  // Register the validate-scaffolder action that calls /v2/dry-run endpoint
  actionsRegistry.register({
    name: 'validate-scaffolder',
    title: 'Validate Scaffolder Template',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `Validates a scaffolder template by dry-running it.
This action:
- Calls scaffolderClient.dryRun()to validate and dry-run template.
- Returns success with execution logs or throws ForwardedError for API/validation failures`,
    schema: {
      input: z =>
        z.object({
          templateYaml: z
            .string()
            .describe(
              'The YAML content of the scaffolder template to validate',
            ),
          values: z
            .record(z.unknown())
            .optional()
            .describe('Input values for template parameters (default: {})'),
          directoryContents: z
            .array(
              z.object({
                path: z
                  .string()
                  .describe('File path relative to template root'),
                base64Content: z
                  .string()
                  .describe('Base64-encoded file content'),
              }),
            )
            .optional()
            .describe('Optional directory contents for template files'),
        }),
      output: z =>
        z.object({
          valid: z.boolean().describe('Whether the template is valid'),
          message: z
            .string()
            .describe('Success message or validation error details'),
          errors: z
            .array(z.string())
            .optional()
            .describe('List of validation errors'),
          log: z
            .array(
              z.object({
                message: z.string(),
                stepId: z.string().optional(),
                status: z.string().optional(),
              }),
            )
            .optional()
            .describe('Execution log from dry-run'),
          output: z
            .record(z.unknown())
            .optional()
            .describe('Template output values'),
          steps: z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                action: z.string(),
              }),
            )
            .optional()
            .describe('Parsed template steps'),
        }),
    },
    action: async ({ input }: { input: any }) => {
      const { templateYaml, values = {}, directoryContents = [] } = input;

      try {
        // Parse YAML content
        let template: TemplateEntityV1beta3;
        try {
          template = yaml.parse(templateYaml) as TemplateEntityV1beta3;
        } catch (parseError: any) {
          return {
            output: {
              valid: false,
              message: 'Failed to parse YAML template',
              errors: [
                `YAML parsing error: ${parseError.message}`,
                parseError.linePos
                  ? `At line ${parseError.linePos[0].line}, column ${parseError.linePos[0].col}`
                  : '',
              ].filter(Boolean),
            },
          };
        }

        // Use ScaffolderClient to call the dryRun API
        // - Template validation
        // - Parameter validation
        // - Dry-run execution of all steps
        const result = await scaffolderClient.dryRun({
          template,
          values,
          directoryContents,
        });

        return {
          output: {
            valid: true,
            message: 'Template validation successful',
            log: result.log?.map((entry: any) => ({
              message: entry.body?.message || entry.message,
              stepId: entry.body?.stepId || entry.stepId,
              status: entry.body?.status || entry.status,
            })),
            output: result.output,
            steps: result.steps,
          },
        };
      } catch (error: any) {
        // Use ForwardedError to properly propagate errors from the scaffolder API
        // This allows the Actions Service to handle and forward the error appropriately
        throw new ForwardedError('Template validation failed', error);
      }
    },
  });
};
