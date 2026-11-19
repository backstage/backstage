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

import type { AnyModel } from '@earendil-works/pi-ai';
import type { AiCredentialKind, AiProviderModule } from './types';
import { compileDestinationTemplate } from './templates';

/**
 * Options for pinning a certified module behind a custom gateway.
 *
 * @alpha
 */
export type WrapProviderModuleOptions = Readonly<{
  /**
   * The gateway's base URL. Its path prefix is joined onto every certified
   * route template of the wrapped module, so a gateway that re-roots the API
   * under its own path still produces destinations the journal certifies.
   */
  baseUrl: string;
  /**
   * Credential kinds the wrapper consumes. Defaults to `['api_key']`:
   * credentials are keyed by the gateway's own provider id, and a gateway
   * API key is the supported interpretation. OAuth through a gateway is not
   * supported and is refused here with guidance.
   */
  credentialKinds?: readonly AiCredentialKind[];
}>;

/**
 * Wraps one certified provider module for dispatch through a custom gateway.
 *
 * @remarks
 *
 * A gateway entry in the model catalog keeps the certified `api` and only
 * changes the base URL, so the wrapped module's adapter, envelope validation
 * and authority interpretation carry over unchanged. The wrapper contributes
 * exactly two things: the gateway base, joined onto every certified route
 * template and destination at construction, and the credential
 * interpretation, keyed by the gateway's own provider id. A module without
 * certified destinations — a local tool module, for example — is rejected
 * at construction, because there is no route to compose the gateway base
 * onto.
 *
 * Route templates stay suffix-composed from the module's own certified
 * shapes — the journal's template check is untouched and now sees
 * `basePath + route`. A wrapped module replaces the direct module for its
 * `api` in the registry it is registered into: both declare the same module
 * id, and a host that wants the direct route and the gateway route for one
 * `api` registers one or the other, never both.
 *
 * @alpha
 */
export function wrapProviderModule(
  module: AiProviderModule,
  options: WrapProviderModuleOptions,
): AiProviderModule {
  let base: URL;
  try {
    base = new URL(options.baseUrl);
  } catch {
    throw new Error('Gateway base URL is not a valid URL');
  }
  if (
    (base.protocol !== 'https:' && base.protocol !== 'http:') ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  ) {
    throw new Error(
      'Gateway base URL must be a bare http(s) origin with an optional path prefix',
    );
  }
  const basePath = base.pathname.replace(/\/+$/, '');
  if (!/^[A-Za-z0-9._~:/-]*$/.test(basePath)) {
    throw new Error(
      'Gateway base path must contain only route-literal characters',
    );
  }
  // A module without certified destinations (a local tool module, for
  // example) cannot be re-rooted onto a gateway: there is no route to
  // compose the base onto.
  if (!module.destination || !module.destinationTemplates) {
    throw new Error(
      `Cannot wrap module '${module.id}' for a gateway: it declares no certified destinations`,
    );
  }
  const innerDestination = module.destination;
  const innerTemplates = module.destinationTemplates;
  const kinds = options.credentialKinds ?? ['api_key'];
  if (kinds.includes('oauth')) {
    throw new Error(
      "OAuth through a gateway is not supported: the wrapper consumes an 'api_key' credential keyed by the gateway's provider id. Store an API key for the gateway instead",
    );
  }
  // Empirical alignment: the module's own destination, probed once at
  // construction with a model pinned at the gateway base, shows the route it
  // actually appends. A family whose certified template already carries the
  // provider's own base path (the catalog pins the model at a path-suffixed
  // base) composes differently from one whose template is the bare route,
  // and the probe tells them apart without new template grammar.
  let probePath: string | undefined;
  try {
    const probe = new URL(
      innerDestination(
        { baseUrl: options.baseUrl } as unknown as AnyModel,
        undefined,
      ),
    );
    probePath = probe.pathname;
  } catch {
    probePath = undefined;
  }
  return {
    ...module,
    credentialKinds: [...kinds],
    destinationTemplates: innerTemplates.map(template => {
      const [first, ...rest] = template;
      if (!first || !('literal' in first)) {
        throw new Error(
          `Cannot compose a gateway prefix onto module '${module.id}': its route template does not start with a literal part`,
        );
      }
      let prefix = basePath;
      if (probePath !== undefined) {
        // The composite must equal the probed route: find where the wrapped
        // template matches the probe's tail, and keep everything before it.
        const match = compileDestinationTemplate(template);
        for (let at = 0; at <= probePath.length; at += 1) {
          if (probePath.charCodeAt(at) === 0x2f && match(probePath.slice(at))) {
            prefix = at === 0 ? '' : probePath.slice(0, at);
            break;
          }
        }
      }
      return [{ literal: `${prefix}${first.literal}` }, ...rest];
    }),
    destination: (model: AnyModel, env: Record<string, string> | undefined) => {
      const target = new URL(innerDestination(model, env));
      // The route the module appends beyond its model's own base path,
      // re-rooted onto the gateway base: a model pinned at the gateway
      // passes through unchanged, and one still pinned at the provider's
      // direct base is re-rooted, the same join the templates declare.
      let route = target.pathname;
      if (model.baseUrl) {
        const modelPath = new URL(model.baseUrl).pathname.replace(/\/+$/, '');
        if (modelPath && target.pathname.startsWith(`${modelPath}/`)) {
          route = target.pathname.slice(modelPath.length);
        }
      }
      return new URL(`${basePath}${route}${target.search}${target.hash}`, base)
        .href;
    },
  };
}
