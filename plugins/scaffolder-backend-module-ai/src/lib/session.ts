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

import type { Config } from '@backstage/config';
import type {
  BackstageCredentials,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import type { AiService, ManagedHarness } from '@backstage/ai-node/alpha';
import {
  aiModelPermissionRules,
  allowsConditional,
  authorizeConditionalDecision,
} from '@backstage/ai-node/alpha';
import { aiModelUsePermission } from '@backstage/plugin-ai-common';
import { createRegistry } from '@earendil-works/pi-durable';
import type { Message } from '@earendil-works/pi-ai';

/**
 * The scaffolder plugin's own AI configuration path: `mode` and the optional
 * configured `model` of every AI-backed scaffolder action.
 *
 * @remarks
 *
 * This is the per-plugin agent configuration, distinct from the
 * installation-scoped `ai` section that configures the model catalog and
 * credentials.
 */
export const SCAFFOLDER_AI_CONFIG_PATH = 'scaffolder.ai';

/**
 * Stable identity of the registry definition set every action runs with: the
 * built-in tasks of the pinned pi-durable engine, and nothing else.
 */
const REGISTRY_VERSION = 'pi-durable-1.5.2-builtin';

/** The model the scaffolder plugin configured, if any. */
export type ConfiguredModel = Readonly<{
  provider: string;
  modelId: string;
}>;

/**
 * Reads the model the scaffolder plugin configured at
 * {@link SCAFFOLDER_AI_CONFIG_PATH}, if one is selected.
 */
export function configuredModel(root: Config): ConfiguredModel | undefined {
  const section = root.getOptionalConfig(SCAFFOLDER_AI_CONFIG_PATH);
  const model = section?.getOptionalConfig('model');
  const provider = model?.getOptionalString('provider');
  const modelId = model?.getOptionalString('modelId');
  if (provider === undefined || modelId === undefined) {
    return undefined;
  }
  return { provider, modelId };
}

/** The conversation handle type of a managed harness's root conversation. */
type Conversation = Awaited<ReturnType<ManagedHarness['harness']['root']>>;

/**
 * The newest assistant reply of a conversation, or undefined when the
 * conversation holds none.
 */
async function latestAssistantText(
  conversation: Conversation,
  context: ManagedHarness['context'],
): Promise<string | undefined> {
  const page = await conversation.entries({}, 50, undefined, context);
  for (const entry of page.items) {
    const reply = entry.model?.findLast(
      (message): message is Extract<Message, { role: 'assistant' }> =>
        message.role === 'assistant',
    );
    const text = reply?.content
      .filter(
        (block): block is { type: 'text'; text: string } =>
          block.type === 'text',
      )
      .map(block => block.text)
      .join('');
    if (text !== undefined && text.length > 0) {
      return text;
    }
  }
  return undefined;
}

/** Renders a settlement detail as displayable text. */
function renderDetail(detail: unknown): string {
  if (detail === undefined) {
    return '';
  }
  return `: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`;
}

/**
 * Renders the failure of a request that did not complete, mapped to its
 * settlement reason: cancelled runs say so, an unlisted model names the
 * catalog, missing credentials name the provider configuration, and a
 * permission denied during the run names the model permission. The generic
 * fallback never advises about models or credentials the reason does not
 * support.
 */
async function settlementFailure(options: {
  sessionId: string;
  permissions: PermissionsService;
  credentials: BackstageCredentials;
  settled: { reason: string; detail?: unknown };
  model: ConfiguredModel | undefined;
}): Promise<Error> {
  const { sessionId, settled, model } = options;
  const detail = renderDetail(settled.detail);
  const prefix = `The AI request of scaffolder task session '${sessionId}'`;
  if (settled.reason === 'aborted') {
    return new Error(
      `${prefix} was cancelled before it completed. The attempt was recorded in the installation's AI audit journal`,
    );
  }
  if (settled.reason === 'no_model' && model !== undefined) {
    return new Error(
      `${prefix} did not complete (reason: 'no_model'): the configured model '${model.provider}/${model.modelId}' is not available; it is not in this installation's 'ai.models' catalog. Ask an administrator to list it`,
    );
  }
  if (
    settled.reason === 'model_error' &&
    typeof settled.detail === 'string' &&
    settled.detail.includes('credentials are not configured')
  ) {
    return new Error(
      `${prefix} did not complete (reason: 'model_error'${detail}). Ask an administrator to configure credentials for the configured model's provider`,
    );
  }
  if (settled.reason === 'model_error' && model !== undefined) {
    // A dispatch denied mid-run settles as a model error whose provider
    // detail does not carry the denial reason, so re-check the model
    // permission now: a denial that appeared during the run is named. The
    // attribution helper must never replace the AI-side diagnostic: a
    // permissions backend that fails here falls through to the generic
    // settlement failure.
    try {
      const decision = await authorizeConditionalDecision(
        options.permissions,
        aiModelUsePermission,
        options.credentials,
      );
      const allowed = allowsConditional(
        decision,
        Object.values(aiModelPermissionRules),
        { provider: model.provider, modelId: model.modelId },
      );
      if (!allowed) {
        return new Error(
          `${prefix} did not complete (reason: 'model_error'${detail}). The submitting user is no longer allowed to use the model '${model.provider}/${model.modelId}': the 'ai.model.use' permission was denied during the run; ask an administrator for access`,
        );
      }
    } catch {
      // Fall through to the generic settlement failure.
    }
  }
  return new Error(
    `${prefix} did not complete (reason: '${settled.reason}'${detail}). The decision was recorded in the installation's AI audit journal; ask an administrator to review the denial`,
  );
}

/**
 * Runs one completion through the managed AI service: opens the submitting
 * user's session, applies the action's instructions, submits the prompt and
 * returns the assistant reply.
 *
 * @remarks
 *
 * The request runs under the submitting user's credentials end to end: the
 * session is owned by that user, every model dispatch is authorized,
 * journaled and fenced by the managed service, and a denial settles the
 * request with its recorded reason instead of a fallback.
 */
export async function runManagedCompletion(options: {
  ai: AiService;
  root: Config;
  credentials: BackstageCredentials;
  permissions: PermissionsService;
  /** The scaffolder task's session identity, stable across task retries. */
  sessionId: string;
  instructions: string;
  prompt: string;
  logger: LoggerService;
  signal?: AbortSignal;
}): Promise<string> {
  // A task cancelled before the action started must not pay for a dispatch.
  if (options.signal?.aborted) {
    throw new Error(
      `The AI request of scaffolder task session '${options.sessionId}' was cancelled before it started`,
    );
  }
  options.logger.info(`Opening the managed AI session '${options.sessionId}'`);
  const handle = await options.ai.openHarness({
    sessionId: options.sessionId,
    config: { root: options.root, path: SCAFFOLDER_AI_CONFIG_PATH },
    credentials: options.credentials,
    registry: createRegistry(),
    registryVersion: REGISTRY_VERSION,
  });
  try {
    const conversation = await handle.harness.root(handle.context);
    // A scaffolder cancellation aborts the run; admitted durable work is
    // settled by the engine, never dropped.
    const abort = () => {
      void conversation.abort(handle.context).catch(() => undefined);
    };
    options.signal?.addEventListener('abort', abort, { once: true });
    try {
      // A task cancelled while the session opened must not pay for a
      // dispatch either.
      if (options.signal?.aborted) {
        throw new Error(
          `The AI request of scaffolder task session '${options.sessionId}' was cancelled before it started`,
        );
      }
      await conversation.configure(
        { instructions: options.instructions },
        handle.context,
      );
      options.logger.info('Submitting the AI request');
      const submission = await conversation.submit(
        { type: 'input', content: options.prompt },
        handle.context,
      );
      const settled = await submission.wait(handle.context);
      if (settled.status !== 'done') {
        throw await settlementFailure({
          sessionId: options.sessionId,
          permissions: options.permissions,
          credentials: options.credentials,
          settled,
          model: configuredModel(options.root),
        });
      }
      const reply = await latestAssistantText(conversation, handle.context);
      if (reply === undefined) {
        throw new Error(
          `The AI request of scaffolder task session '${options.sessionId}' completed without a reply`,
        );
      }
      return reply;
    } finally {
      options.signal?.removeEventListener('abort', abort);
    }
  } finally {
    await handle.release();
  }
}

/**
 * Authorizes the submitting user for the configured model before the
 * session opens, so a denied user sees the model permission at the action
 * boundary.
 *
 * @remarks
 *
 * Uses the managed AI service's fixed `ai.model.use` permission and evaluates
 * the policy's conditions against the configured pair with the model rules, so
 * a conditional policy (one model, one provider, or one model type) decides
 * exactly as it does for dispatch; the managed service re-checks it at
 * admission and on every dispatch. When no model is configured the check is
 * skipped and dispatch defers to the service. The denial names both
 * remedies without asserting which one applies: the user may lack the
 * permission, or the model may not be listed in the installation catalog.
 */
export async function authorizeConfiguredModel(options: {
  permissions: PermissionsService;
  credentials: BackstageCredentials;
  model: ConfiguredModel;
  actionId: string;
}): Promise<void> {
  const decision = await authorizeConditionalDecision(
    options.permissions,
    aiModelUsePermission,
    options.credentials,
  );
  if (
    !allowsConditional(decision, Object.values(aiModelPermissionRules), {
      provider: options.model.provider,
      modelId: options.model.modelId,
    })
  ) {
    throw new Error(
      `Access denied: the submitting user is not allowed to use the model '${options.model.provider}/${options.model.modelId}' configured for the '${options.actionId}' action. The 'ai.model.use' permission was denied; ask an administrator to grant access, or configure a model that is listed in this installation's 'ai.models' catalog`,
    );
  }
}
