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

import { dirname, isAbsolute } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import type {
  BackstageCredentials,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import type { AiService } from '@backstage/ai-node/alpha';
import {
  authorizeConfiguredModel,
  catalogModelType,
  configuredModel,
  runManagedCompletion,
} from '../lib/session';
import { generateExamples } from './aiGenerate.examples';
import { transformExamples } from './aiTransform.examples';

/**
 * Options shared by every AI-backed scaffolder action.
 *
 * @public
 */
export interface AiActionOptions {
  /** The managed AI service the actions run through. */
  ai: AiService;
  /** The root configuration, read at the scaffolder plugin's AI path. */
  config: Config;
  /** Authorizes the submitting user for the configured model. */
  permissions: PermissionsService;
}

/**
 * Runs one completion for an action: authorizes the submitting user for the
 * configured model, then drives the managed session. The stage boundaries
 * are logged, which the scaffolder UI surfaces as step progress.
 */
async function complete(options: {
  deps: AiActionOptions;
  actionId: string;
  logger: LoggerService;
  sessionId: string;
  credentials: BackstageCredentials;
  instructions: string;
  prompt: string;
  signal?: AbortSignal;
}): Promise<string> {
  const model = configuredModel(options.deps.config);
  if (model !== undefined) {
    await authorizeConfiguredModel({
      permissions: options.deps.permissions,
      credentials: options.credentials,
      model,
      type: catalogModelType(options.deps.config, model),
      actionId: options.actionId,
    });
  }
  return runManagedCompletion({
    ai: options.deps.ai,
    root: options.deps.config,
    credentials: options.credentials,
    permissions: options.deps.permissions,
    sessionId: options.sessionId,
    instructions: options.instructions,
    prompt: options.prompt,
    logger: options.logger,
    signal: options.signal,
  });
}

/**
 * Creates the `ai:generate` scaffolder action.
 *
 * @remarks
 *
 * Generates text content — file seeds, READMEs, PR descriptions — from a
 * prompt and optional context, using the model configured for the
 * scaffolder plugin. The request runs under the submitting user's
 * credentials through the managed AI service; the output is either returned
 * as `content` or written to a path in the workspace.
 *
 * @public
 */
export function createAiGenerateAction(options: AiActionOptions) {
  return createTemplateAction({
    id: 'ai:generate',
    description:
      "Generates content from a prompt using the AI model configured for the scaffolder plugin, under the submitting user's credentials",
    examples: generateExamples,
    schema: {
      input: {
        prompt: z => z.string().describe('What the model should generate'),
        context: z =>
          z
            .string()
            .optional()
            .describe(
              'Additional context for the model, such as repository or file contents',
            ),
        instructions: z =>
          z
            .string()
            .optional()
            .describe(
              'Extra instructions for how to generate the content, such as tone or format requirements',
            ),
        outputPath: z =>
          z
            .string()
            .optional()
            .describe(
              'Write the generated content to this path in the workspace instead of returning it as an output',
            ),
      },
      output: {
        content: z =>
          z
            .string()
            .optional()
            .describe(
              'The generated content; present when no outputPath was given',
            ),
      },
    },
    async handler(ctx) {
      const credentials = await ctx.getInitiatorCredentials();
      const reply = await complete({
        deps: options,
        actionId: 'ai:generate',
        logger: ctx.logger,
        sessionId: ctx.task.id,
        signal: ctx.signal,
        credentials,
        instructions: [
          'You generate content for a software templating task.',
          'Return the requested content directly, without surrounding explanations.',
          ctx.input.instructions ?? '',
        ]
          .filter(Boolean)
          .join('\n'),
        prompt: ctx.input.context
          ? `${ctx.input.prompt}\n\nContext:\n${ctx.input.context}`
          : ctx.input.prompt,
      });
      if (ctx.input.outputPath) {
        // The model reply is untrusted content: its destination must stay
        // inside the task's workspace. Absolute paths and `..` segments are
        // rejected up front with an actionable error, and the safe resolver
        // enforces the same guarantee the scaffolder's own file actions use.
        if (isAbsolute(ctx.input.outputPath)) {
          throw new Error(
            `Invalid outputPath '${ctx.input.outputPath}' for the ai:generate action: it must be a relative path inside the task workspace`,
          );
        }
        if (
          ctx.input.outputPath.split(/[\\/]/).some(segment => segment === '..')
        ) {
          throw new Error(
            `Invalid outputPath '${ctx.input.outputPath}' for the ai:generate action: '..' segments are not allowed; write only inside the task workspace`,
          );
        }
        const target = resolveSafeChildPath(
          ctx.workspacePath,
          ctx.input.outputPath,
        );
        ctx.logger.info(`Writing the generated content to ${target}`);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, reply, 'utf8');
        return;
      }
      ctx.output('content', reply);
    },
  });
}

/**
 * Creates the `ai:transform` scaffolder action.
 *
 * @remarks
 *
 * Fills structured parameter values from the submitting user's
 * natural-language answers: the model must return a JSON object matching
 * the supplied schema, and the action returns it as its `values` output for
 * use by later template steps.
 *
 * @public
 */
export function createAiTransformAction(options: AiActionOptions) {
  return createTemplateAction({
    id: 'ai:transform',
    description:
      "Fills structured values from the submitting user's natural-language answers using the AI model configured for the scaffolder plugin",
    examples: transformExamples,
    schema: {
      input: {
        prompt: z =>
          z
            .string()
            .describe(
              "The user's natural-language answers or request to structure",
            ),
        schema: z =>
          z
            .record(z.string(), z.unknown())
            .describe(
              'JSON Schema describing the object of values to produce; the model returns one JSON object matching it',
            ),
        instructions: z =>
          z.string().optional().describe('Extra instructions for filling'),
      },
      output: {
        values: z =>
          z.record(z.string(), z.unknown()).describe('The structured values'),
      },
    },
    async handler(ctx) {
      const credentials = await ctx.getInitiatorCredentials();
      const reply = await complete({
        deps: options,
        actionId: 'ai:transform',
        logger: ctx.logger,
        sessionId: ctx.task.id,
        signal: ctx.signal,
        credentials,
        instructions: [
          'You fill structured values for a software templating task.',
          'Return ONLY a single JSON object matching the supplied schema, with no surrounding text, prose, or code fences.',
          ctx.input.instructions ?? '',
        ]
          .filter(Boolean)
          .join('\n'),
        prompt: `${
          ctx.input.prompt
        }\n\nThe JSON object must match this schema:\n${JSON.stringify(
          ctx.input.schema,
        )}`,
      });
      ctx.output('values', parseValues(reply, ctx.task.id));
    },
  });
}

/** Parses the model reply into the structured values output. */
function parseValues(
  reply: string,
  sessionId: string,
): Record<string, unknown> {
  const stripped = reply
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
  try {
    const parsed: unknown = JSON.parse(stripped);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Fall through to the actionable error below.
  }
  throw new Error(
    `The AI model returned values that are not a JSON object for scaffolder task session '${sessionId}'. Ask the model for a JSON object matching the schema, or adjust the schema; the reply started with: ${reply.slice(
      0,
      200,
    )}`,
  );
}
