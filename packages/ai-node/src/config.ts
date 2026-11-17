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

import type { ConfigAtPath } from './contracts';

/**
 * Execution mode chosen at a plugin's own configuration path.
 *
 * @remarks
 *
 * `service` mode is for configured background execution and requires a model.
 * `interactive` mode may defer model selection until an explicit choice, but
 * generation is never permitted without a model.
 *
 * @alpha
 */
export type AiServiceMode = 'service' | 'interactive';

/**
 * Native reasoning setting; Pi's `ModelThinkingLevel` values, verbatim.
 *
 * @alpha
 */
export type AiServiceThinkingLevel =
  | 'off'
  | 'minimal'
  | 'low'
  | 'medium'
  | 'high'
  | 'xhigh'
  | 'max';

/**
 * Native model selection: actual provider and model identifiers, no aliases.
 *
 * @alpha
 */
export type AiServiceModel = Readonly<{
  provider: string;
  modelId: string;
}>;

/**
 * The initial AI configuration schema at a caller-supplied path.
 *
 * @remarks
 *
 * This is the initial schema only: it initializes new conversations and never
 * resets persisted state. Provider credential configuration and key material
 * are installation-scoped and validated separately.
 *
 * @alpha
 */
export type AiServiceConfig = Readonly<{
  mode: AiServiceMode;
  model?: AiServiceModel;
  thinkingLevel?: AiServiceThinkingLevel;
}>;

const MODES: readonly AiServiceMode[] = ['service', 'interactive'];

const THINKING_LEVELS: readonly AiServiceThinkingLevel[] = [
  'off',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
];

function configError(pluginId: string, message: string): Error {
  return new Error(
    `Invalid AI configuration for the '${pluginId}' plugin: ${message}`,
  );
}

function fieldValueError(
  pluginId: string,
  path: string,
  field: string,
  guidance: string,
): Error {
  return configError(
    pluginId,
    `at '${path}', the field '${field}' is invalid. ${guidance}`,
  );
}

/**
 * Parses and validates the initial AI configuration at the caller-supplied
 * path.
 *
 * @remarks
 *
 * There is no implicit configuration path: `source.path` selects the section
 * inside `source.root`. Every failure names the consuming plugin, the exact
 * configuration path, the offending field, and corrective guidance. Service
 * mode requires `model.provider` and `model.modelId`; interactive mode may
 * omit the model until an explicit selection.
 *
 * @alpha
 */
export function parseAiServiceConfig(
  source: ConfigAtPath,
  pluginId: string,
): AiServiceConfig {
  const section = source.root.getOptionalConfig(source.path);
  if (section === undefined) {
    throw configError(
      pluginId,
      `no configuration found at '${source.path}'. Add a '${source.path}' section to app-config with at least 'mode: service' or 'mode: interactive', for example '${source.path}: { mode: service, model: { provider: <provider-id>, modelId: <model-id> } }'`,
    );
  }

  for (const key of section.keys()) {
    if (key !== 'mode' && key !== 'model' && key !== 'thinkingLevel') {
      throw configError(
        pluginId,
        `at '${source.path}', the field '${key}' is not part of the AI configuration schema. Remove it; the accepted fields are 'mode', 'model', and 'thinkingLevel'`,
      );
    }
  }

  const mode = section.getOptionalString('mode');
  if (mode === undefined) {
    throw configError(
      pluginId,
      `at '${source.path}', the required field 'mode' is missing. Set 'mode: service' for configured background execution, or 'mode: interactive' to defer model selection to the caller`,
    );
  }
  if (!MODES.includes(mode as AiServiceMode)) {
    throw fieldValueError(
      pluginId,
      source.path,
      'mode',
      `Expected 'service' or 'interactive', but got '${mode}'`,
    );
  }

  let model: AiServiceModel | undefined;
  const modelSection = section.getOptionalConfig('model');
  if (modelSection !== undefined) {
    for (const key of modelSection.keys()) {
      if (key !== 'provider' && key !== 'modelId') {
        throw configError(
          pluginId,
          `at '${source.path}.model', the field '${key}' is not part of the AI configuration schema. Remove it; the accepted fields are 'provider' and 'modelId'`,
        );
      }
    }
    const provider = modelSection.getOptionalString('provider');
    const modelId = modelSection.getOptionalString('modelId');
    if (provider === undefined || modelId === undefined) {
      throw fieldValueError(
        pluginId,
        `${source.path}.model`,
        provider === undefined ? 'provider' : 'modelId',
        `'model.provider' and 'model.modelId' must both be set to the actual provider and model identifiers, or the whole 'model' section must be omitted. A model is required for 'mode: service'; for 'mode: interactive' it may be omitted until an explicit selection`,
      );
    }
    model = { provider, modelId };
  }

  const thinkingLevel = section.getOptionalString('thinkingLevel');
  if (
    thinkingLevel !== undefined &&
    !THINKING_LEVELS.includes(thinkingLevel as AiServiceThinkingLevel)
  ) {
    throw fieldValueError(
      pluginId,
      source.path,
      'thinkingLevel',
      `Expected one of ${THINKING_LEVELS.map(level => `'${level}'`).join(
        ', ',
      )}, but got '${thinkingLevel}'`,
    );
  }

  if (mode === 'service' && model === undefined) {
    throw configError(
      pluginId,
      `at '${source.path}', 'mode: service' requires 'model.provider' and 'model.modelId', but no model is configured. Configure the model that service execution should use, or switch to 'mode: interactive' to defer model selection to the caller`,
    );
  }

  return {
    mode: mode as AiServiceMode,
    ...(model === undefined ? {} : { model }),
    ...(thinkingLevel === undefined
      ? {}
      : { thinkingLevel: thinkingLevel as AiServiceThinkingLevel }),
  };
}
