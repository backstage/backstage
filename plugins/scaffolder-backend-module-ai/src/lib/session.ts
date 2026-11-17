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

/** Renders the settlement of a request that did not complete. */
function settlementError(
  sessionId: string,
  settled: { reason: string; detail?: unknown },
  model: ConfiguredModel | undefined,
): Error {
  const detail =
    settled.detail === undefined
      ? ''
      : `: ${
          typeof settled.detail === 'string'
            ? settled.detail
            : JSON.stringify(settled.detail)
        }`;
  // The engine's no-model settlement carries no detail of its own; the
  // configured model is the actionable fact the caller needs.
  const noModel =
    settled.reason === 'no_model' && model !== undefined
      ? `: the configured model '${model.provider}/${model.modelId}' is not available; it is not in this installation's 'ai.models' catalog. Ask an administrator to list it`
      : '';
  return new Error(
    `The AI request of scaffolder task session '${sessionId}' did not complete (reason: '${settled.reason}'${detail}${noModel}). The decision was recorded in the installation's AI audit journal; configure a listed model and credentials, or ask an administrator to review the denial`,
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
  /** The scaffolder task's session identity, stable across task retries. */
  sessionId: string;
  instructions: string;
  prompt: string;
  logger: LoggerService;
  signal?: AbortSignal;
}): Promise<string> {
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
        throw settlementError(
          options.sessionId,
          settled,
          configuredModel(options.root),
        );
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
 * The permission name mirrors the managed AI service's model permission
 * model (`ai.model.<provider>.<modelId>.use`, each segment encoded with
 * `encodeURIComponent` and literal dots encoded as `%2E`); the managed
 * service re-checks it at admission and on every dispatch. When no model is
 * configured the check is skipped and dispatch defers to the service.
 */
export async function authorizeConfiguredModel(options: {
  permissions: PermissionsService;
  credentials: BackstageCredentials;
  model: ConfiguredModel;
  actionId: string;
}): Promise<void> {
  const segment = (value: string) =>
    encodeURIComponent(value).replace(/\./g, '%2E');
  const name = `ai.model.${segment(options.model.provider)}.${segment(
    options.model.modelId,
  )}.use`;
  const decisions = await options.permissions.authorize(
    [{ permission: { type: 'basic', name, attributes: {} } }],
    { credentials: options.credentials },
  );
  if (decisions[0]?.result !== 'ALLOW') {
    throw new Error(
      `Access denied: the submitting user is not allowed to use the model '${options.model.provider}/${options.model.modelId}' configured for the '${options.actionId}' action. The '${name}' permission was denied; ask an administrator for access, or configure a model the user may use`,
    );
  }
}
