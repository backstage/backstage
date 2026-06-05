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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import yaml from 'yaml';
import { z } from 'zod';
import { ReferenceTemplateLoader } from './ReferenceTemplateLoader';
import { WELL_KNOWN_ACTIONS, formatActionsForPrompt } from './wellKnownActions';

const STEP_ACTION_IDS = WELL_KNOWN_ACTIONS.map(a => a.id) as [
  string,
  ...string[],
];

/**
 * Zod schema constraining the LLM's output to a Backstage v1beta3 Template
 * shape. Field set is deliberately a *practical subset* — the model can use
 * `input` to express any action-specific shape.
 *
 * @public
 */
export const TemplateSchema = z.object({
  apiVersion: z.literal('scaffolder.backstage.io/v1beta3'),
  kind: z.literal('Template'),
  metadata: z.object({
    name: z
      .string()
      .regex(
        /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
        'metadata.name must be kebab-case (lowercase, hyphens)',
      ),
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  spec: z.object({
    owner: z.string(),
    type: z.string(),
    parameters: z
      .array(
        z.object({
          title: z.string().optional(),
          required: z.array(z.string()).optional(),
          properties: z.record(z.unknown()).optional(),
        }),
      )
      .optional(),
    steps: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          action: z.enum(STEP_ACTION_IDS),
          input: z.record(z.unknown()).optional(),
          if: z.string().optional(),
        }),
      )
      .min(1, 'spec.steps must contain at least one step'),
    output: z.record(z.unknown()).optional(),
  }),
});

/**
 * @public
 */
export type GeneratedTemplate = z.infer<typeof TemplateSchema>;

/**
 * Minimal generateObject shape we depend on from the Vercel AI SDK.
 * Extracted so tests can stub it.
 * @public
 */
export type GenerateObjectFn<T> = (args: {
  model: unknown;
  schema: z.ZodSchema<T>;
  system: string;
  prompt: string;
  maxOutputTokens?: number;
}) => Promise<{ object: T }>;

/**
 * @public
 */
export interface GenerationResult {
  /** The generated template as YAML, ready to drop into a catalog file. */
  yaml: string;
  /** Parsed object form of the same template. */
  template: GeneratedTemplate;
  /** Refs of the reference templates and well-known actions used as context. */
  citations: {
    referenceTemplates: string[];
    actionsUsed: string[];
  };
  /** Warnings raised during post-generation validation (does not fail). */
  warnings: string[];
}

/**
 * @public
 */
export interface GenerationOptions {
  description: string;
  referenceRefs?: string[];
  credentials?: { token?: string };
}

const SYSTEM_PROMPT_PREAMBLE = `You generate Backstage scaffolder Template entities (v1beta3).

Output strictly conforms to the schema you are given. Hard rules:
1. apiVersion is always "scaffolder.backstage.io/v1beta3" and kind is "Template".
2. metadata.name is kebab-case (lowercase letters, digits, hyphens; starts and ends with alphanumeric).
3. spec.owner must be a Backstage entity reference (e.g. "group:default/platform").
4. Every step's "action" must be one from the curated catalog below — do not invent action ids.
5. Step "input" fields must match the documented input shape for the chosen action.
6. Prefer using {{ values.* }} substitutions (nunjucks) inside step inputs over hardcoding strings derived from the user description.
7. If a parameter is required for an action's input, declare a matching parameter in spec.parameters so the user can supply it.

You may borrow patterns and step layouts from the reference templates the user provides, but the final template must address the user's request — do not return a verbatim copy.`;

/**
 * Generates a Backstage scaffolder Template entity from a natural-language
 * description plus optional reference templates pulled from the catalog.
 *
 * @public
 */
export class TemplateGenerationService {
  constructor(
    private readonly referenceLoader: ReferenceTemplateLoader,
    private readonly model: unknown,
    private readonly generateObject: GenerateObjectFn<GeneratedTemplate>,
    private readonly logger: LoggerService,
    private readonly defaultOwner: string,
  ) {}

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const description = options.description?.trim();
    if (!description) {
      throw new InputError('description must not be empty');
    }

    const refs = options.referenceRefs ?? [];
    const references = await this.referenceLoader.load(refs, {
      credentials: options.credentials,
    });

    const prompt = buildPrompt(description, references);
    const system = buildSystemPrompt();

    this.logger.debug(
      `template-authoring: generating with ${references.length} reference template(s)`,
    );

    const { object } = await this.generateObject({
      model: this.model,
      schema: TemplateSchema,
      system,
      prompt,
    });

    // If the model omitted a required field that we can fill safely, fill it
    // here rather than failing the request. owner is the common case — many
    // models leave it blank.
    const warnings: string[] = [];
    if (!object.spec.owner) {
      object.spec.owner = this.defaultOwner;
      warnings.push(
        `spec.owner was missing; defaulted to '${this.defaultOwner}'`,
      );
    }

    const yamlText = yaml.stringify(object, { lineWidth: 0 });

    return {
      yaml: yamlText,
      template: object,
      citations: {
        referenceTemplates: refs,
        actionsUsed: collectActionIds(object),
      },
      warnings,
    };
  }
}

function buildSystemPrompt(): string {
  return `${SYSTEM_PROMPT_PREAMBLE}

Curated scaffolder action catalog:

${formatActionsForPrompt()}
`;
}

function buildPrompt(description: string, references: Entity[]): string {
  const refsBlock = references.length
    ? `Reference templates (study their step layout, do not copy verbatim):\n\n${references
        .map(
          r =>
            `--- ${r.metadata.namespace ?? 'default'}/${
              r.metadata.name
            } ---\n${yaml.stringify(r, { lineWidth: 0 })}`,
        )
        .join('\n\n')}\n\n`
    : '';
  return `${refsBlock}User request:\n${description}\n\nGenerate the template now.`;
}

function collectActionIds(template: GeneratedTemplate): string[] {
  const ids = new Set<string>();
  for (const step of template.spec.steps) {
    ids.add(step.action);
  }
  return [...ids];
}
