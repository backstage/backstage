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
import { ScaffolderClient } from '@backstage/plugin-scaffolder-common';
// import { ForwardedError } from '@backstage/errors';
import yaml from 'yaml';

const MAX_CONTENT_SIZE = 64 * 1024;

function base64EncodeContent(content: string): string {
  if (content.length > MAX_CONTENT_SIZE) {
    return Buffer.from('<file too large>', 'utf8').toString('base64');
  }
  return Buffer.from(content, 'utf8').toString('base64');
}

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
- Returns success with execution logs or errors for validation failures`,
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
          files: z
            .array(
              z.object({
                path: z
                  .string()
                  .describe('File path relative to template root'),
                content: z.string().describe('file content'),
              }),
            )
            .optional()
            .describe('files required for running the template'),
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
      const { templateYaml, values = {}, files = [] } = input;

      try {
        // Parse YAML content
        let template;
        try {
          template = yaml.parse(templateYaml);
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
          directoryContents: files.map(
            (file: { path: string; content: string }) => ({
              path: file.path,
              base64Content: base64EncodeContent(file.content),
            }),
          ),
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
        // Extract error messages from ResponseError or generic errors
        const errorMessages: string[] = [];

        if (error.name === 'ResponseError' || error.body) {
          // Extract from API response
          if (error.body?.error?.message)
            errorMessages.push(error.body?.error?.message);
          if (error.body?.errors) errorMessages.push(error.body?.errors);
        } else if (error.message) {
          errorMessages.push(error.message);
        }

        return {
          output: {
            valid: false,
            message: 'Template validation failed',
            errors: errorMessages,
          },
        };
      }
    },
  });
};
