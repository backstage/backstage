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
  Credential,
} from '@earendil-works/pi-ai';
import type { CredentialScope } from '../credentials/types';
import type { AiAuthModule } from './auth/types';
import type { DestinationTemplate } from './templates';

/**
 * The dispatch authority a module derives from a stored credential. Modules
 * that carry their own credential interpretation (tool servers) return this;
 * modules without it use the shared model-provider semantics.
 *
 * @alpha
 */
export type ModuleAuthority = Readonly<{
  authority: Readonly<{
    kind: 'apiKey' | 'oauth' | 'federation';
    apiKey?: string;
    headers?: Record<string, string | null>;
    env?: Record<string, string>;
    expiresAt?: number;
  }>;
  generation: string;
}>;

/**
 * Provider-visible envelope metadata, without authorization or fence state.
 *
 * @alpha
 */
export type ProviderEnvelope = Readonly<{
  api: string;
  operation: string;
  modelId: string;
  resolvedModel: string;
  destination: string;
  authTokenDestinations?: readonly string[];
}>;

/**
 * Pinned stream adapters or custom non-chat dispatch, invoked by the host.
 *
 * @alpha
 */
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

/** A credential kind a provider module consumes. @alpha */
export type AiCredentialKind = 'api_key' | 'oauth';

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
 * The optional credential, permission and dispatch hooks are the generic
 * module resolution seam: tool server modules carry their own through it,
 * consumed by the integration without module-specific branches.
 *
 * @alpha
 */
export type AiProviderModule = Readonly<{
  id: string;
  adapter: ProviderAdapter;
  /**
   * The credential kinds this module consumes. A family that ships an OAuth
   * auth module declares `oauth` alongside `api_key`; an API-key-only family
   * declares `api_key` alone, so a configured or stored credential of a kind
   * it cannot interpret is refused instead of reaching the wire.
   *
   * Composition validates installation config against the modules used by the
   * configured models (fail-fast at startup) and dispatch refuses a credential
   * whose kind the resolved module does not declare, with guidance naming the
   * supported kinds.
   */
  credentialKinds: readonly AiCredentialKind[];
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
  /**
   * The family's OAuth auth module, when it has one.
   *
   * @remarks
   * Carried by the provider module so the auth path travels with the family
   * that needs it: registering a family's modules registers its OAuth refresh
   * with it, through the same `providerModules` surface every consumer already
   * uses. The auth module is consulted only for that family's OAuth refresh and
   * is part of the family's trust surface — it is trusted in-process code with
   * access to the guarded token transport, exactly like the dispatch module.
   */
  authModule?: AiAuthModule;
  /**
   * The scoped-store key this module's credentials live under. Tool servers
   * key under the reserved `mcp:` prefix; modules without this hook use the
   * provider id itself.
   */
  credentialKey?(providerId: string): string;
  /**
   * Interprets a stored credential as dispatch authority plus its generation
   * identity. Modules without this hook use the shared model-provider
   * interpretation.
   */
  interpretCredential?(
    scope: CredentialScope,
    credential: Credential,
  ): ModuleAuthority;
  /**
   * Optional module-carried binding resolution for operations resolved
   * outside the canonical model catalog (tool servers): the module supplies
   * the dispatch facts and consumes the host's credential resolution; the
   * host builds the trusted operation from them. Modules without this hook
   * resolve through the canonical catalog like every model dispatch.
   *
   * The invariant the host enforces: the credential resolution is bound to
   * the module's own identity (never to caller-supplied provider strings),
   * and the returned api must name the module itself, so the resolved
   * module, the provider id on the operation, and the credential key always
   * agree.
   */
  resolveDispatch?(
    model: AnyModel,
    resolveCredential: () => Promise<
      | {
          scope: CredentialScope;
          authority: ModuleAuthority['authority'];
          generation: string;
        }
      | undefined
    >,
  ): Promise<
    | {
        resolved: true;
        api: string;
        destination: string;
        authority: ModuleAuthority['authority'];
        credentialScope: CredentialScope;
        credentialGeneration: string;
      }
    | { resolved: false; reason: string }
  >;
}>;
