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

import type {
  AnyModel,
  AssistantMessageEventStream,
} from '@earendil-works/pi-ai';
import type { DestinationTemplate } from './templates';

/** Provider-visible envelope metadata, without authorization or fence state. */
export type ProviderEnvelope = Readonly<{
  api: string;
  operation: string;
  modelId: string;
  resolvedModel: string;
  destination: string;
  authTokenDestinations?: readonly string[];
}>;

/** Pinned stream adapters or custom non-chat dispatch, invoked by the host. */
export type ProviderAdapter =
  | Readonly<{
      kind: 'stream';
      stream(
        model: never,
        context: never,
        options: never,
      ): AssistantMessageEventStream;
      streamSimple(
        model: never,
        context: never,
        options: never,
      ): AssistantMessageEventStream;
    }>
  | Readonly<{
      kind: 'custom';
      invoke(
        input: Readonly<{
          operation: string;
          model: AnyModel;
          context: unknown;
          options: Readonly<Record<string, unknown>>;
        }>,
      ): Promise<
        Readonly<{
          value: unknown;
          outcome: 'completed' | 'failed' | 'cancelled';
        }>
      >;
    }>;

/**
 * A host-trusted, in-process provider registration. Modules are not sandboxed:
 * their dispatch receives provider credentials and arbitrary plugin code can
 * access the network directly. Register only code trusted as your own plugin.
 * The managed guard enforces authorization, journaling and send ordering for
 * calls that use its guarded transport; it does not constrain arbitrary code.
 * The guard does not validate payload model identity or query strings. Each
 * module's envelope validator must enforce both; run the substitution checks
 * in `registerProviderCertification` before certifying its operations. An
 * uncertified module is only as strict as its own validator.
 *
 * Operation names are not restricted to chat: future classifier and image
 * modules can declare their own certified operations without editing the
 * journal vocabulary.
 *
 * @internal
 */
export type AiProviderModule = Readonly<{
  id: string;
  adapter: ProviderAdapter;
  certifiedOperations: readonly string[];
  destinationTemplates: readonly DestinationTemplate[];
  destination(model: AnyModel, env: Record<string, string> | undefined): string;
  validateEnvelope(
    operation: ProviderEnvelope,
    request: Request,
  ): Promise<'model' | 'auth.token-exchange'>;
  /** Classify a request for denial attribution before envelope validation. */
  classifyRequest?(url: string): 'model' | 'auth.token-exchange';
  /** The only allowed special transport requested at the pinned SDK boundary. */
  transport?: 'sse';
}>;
