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
import { AuthService, DiscoveryService } from '@backstage/backend-plugin-api';
import {
  templateEntityV1beta3Validator,
  TemplateEntityV1beta3,
} from '@backstage/plugin-scaffolder-common';
import { ResponseError } from '@backstage/errors';
import yaml from 'yaml';

export const createValidateScaffolderAction = ({
  actionsRegistry,
  auth,
  discovery,
}: {
  actionsRegistry: ActionsRegistryService;
  auth: AuthService;
  discovery: DiscoveryService;
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
    description: `Validates a scaffolder template by calling the /v2/dry-run endpoint.
This action:
- Parses and validates the YAML template structure
- Validates the template against the template entity schema
- Calls the /v2/dry-run endpoint to dry-run template steps without side effects
- Returns success with execution logs or specific validation errors`,
    schema: {
      input: (z: any) =>
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
      output: (z: any) =>
        z.object({
          valid: z.boolean().describe('Whether the template is valid'),
          message: z
            .string()
            .describe('Success message or validation error details'),
          errors: z
            .array(z.string())
            .optional()
            .describe('List of specific validation errors'),
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
    action: async ({
      input,
      credentials,
    }: {
      input: any;
      credentials: any;
    }) => {
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

        // Validate template structure
        if (!(await templateEntityV1beta3Validator.check(template))) {
          return {
            output: {
              valid: false,
              message: 'Invalid template structure',
              errors: [
                'Template does not conform to TemplateEntityV1beta3 schema',
              ],
            },
          };
        }

        // Validate that steps exist
        if (!template.spec.steps || template.spec.steps.length === 0) {
          return {
            output: {
              valid: false,
              message: 'Template has no steps defined',
              errors: ['Template must have at least one step'],
            },
          };
        }

        // Get a token to call the scaffolder API
        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: credentials,
          targetPluginId: 'scaffolder',
        });

        // Get the scaffolder base URL
        const baseUrl = await discovery.getBaseUrl('scaffolder');
        const dryRunUrl = `${baseUrl}/v2/dry-run`;

        // Call the /v2/dry-run endpoint
        const response = await fetch(dryRunUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            template,
            values,
            directoryContents,
          }),
        });

        if (!response.ok) {
          throw await ResponseError.fromResponse(response);
        }

        const result = await response.json();

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
        // Extract meaningful error messages
        const errorMessages: string[] = [];

        if (error.message) {
          errorMessages.push(error.message);
        }

        if (error.cause) {
          errorMessages.push(`Cause: ${error.cause.message || error.cause}`);
        }

        if (error.body?.errors && Array.isArray(error.body.errors)) {
          error.body.errors.forEach((err: any) => {
            errorMessages.push(err.message || String(err));
          });
        } else if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((err: any) => {
            errorMessages.push(err.message || String(err));
          });
        }

        return {
          output: {
            valid: false,
            message: 'Template validation failed',
            errors:
              errorMessages.length > 0
                ? errorMessages
                : ['Unknown validation error'],
          },
        };
      }
    },
  });
};
