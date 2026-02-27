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
import { ScaffolderService } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
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
  scaffolderService,
}: {
  actionsRegistry: ActionsRegistryService;
  scaffolderService: ScaffolderService;
}) => {
  actionsRegistry.register({
    name: 'dry-run-template',
    title: 'Dry Run Scaffolder Template',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description:
      'Dry-runs a scaffolder template to validate it without making changes. Returns success with execution logs, or errors for validation failures.',
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
            .describe('Input values for template parameters'),
          files: z
            .array(
              z.object({
                path: z
                  .string()
                  .describe('File path relative to template root'),
                content: z.string().describe('File content'),
              }),
            )
            .optional()
            .describe('Files required for running the template'),
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
    action: async ({ input, credentials }) => {
      const { templateYaml, values = {}, files = [] } = input;

      let template;
      try {
        template = yaml.parse(templateYaml);
      } catch (parseError) {
        const yamlError = parseError as yaml.YAMLParseError;
        return {
          output: {
            valid: false,
            message: 'Failed to parse YAML template',
            errors: [
              `YAML parsing error: ${yamlError.message}`,
              yamlError.linePos
                ? `At line ${yamlError.linePos[0].line}, column ${yamlError.linePos[0].col}`
                : '',
            ].filter(Boolean),
          },
        };
      }

      const result = await scaffolderService.dryRun(
        {
          template,
          values: values as JsonObject,
          directoryContents: files.map(file => ({
            path: file.path,
            base64Content: base64EncodeContent(file.content),
          })),
        },
        { credentials },
      );

      return {
        output: {
          valid: true,
          message: 'Template validation successful',
          log: result.log?.map(entry => ({
            message: entry.body.message,
            stepId: entry.body.stepId,
            status: entry.body.status,
          })),
          output: result.output,
          steps: result.steps,
        },
      };
    },
  });
};
