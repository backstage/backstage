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
  BackstageCredentials,
  PermissionsRegistryService,
  PermissionsService,
} from '@backstage/backend-plugin-api';

export type ModelPair = Readonly<{ provider: string; modelId: string }>;

type BasicPermission = Extract<
  Parameters<PermissionsRegistryService['addPermissions']>[0][number],
  { type: 'basic' }
>;

/**
 * Permission names encode each nonempty, well-formed Unicode segment with
 * encodeURIComponent and additionally encode literal dots as %2E. Case and
 * Unicode normalization are preserved. Names are exact, not wildcards.
 */
export function modelPermissionName({ provider, modelId }: ModelPair): string {
  function segment(value: string): string {
    if (typeof value !== 'string' || !value.length) {
      throw new Error('Model permission segments must be nonempty strings');
    }
    return encodeURIComponent(value).replace(/\./g, '%2E');
  }
  return `ai.model.${segment(provider)}.${segment(modelId)}.use`;
}

/** A snapshot of the canonical registry. Never use caller-supplied pairs as a registry. */
export function createModelPermissions(options: {
  models: readonly ModelPair[];
  authorizer: Pick<PermissionsService, 'authorize'>;
  registry: Pick<PermissionsRegistryService, 'addPermissions'>;
}) {
  const pairs = new Map<
    string,
    { model: ModelPair; permission: BasicPermission }
  >();
  for (const { provider, modelId } of options.models) {
    const model = Object.freeze({ provider, modelId });
    const name = modelPermissionName(model);
    if (!pairs.has(name)) {
      pairs.set(name, {
        model,
        permission: Object.freeze({
          type: 'basic',
          name,
          attributes: Object.freeze({}),
        }),
      });
    }
  }
  options.registry.addPermissions([...pairs.values()].map(p => p.permission));

  async function authorize(
    entries: readonly { model: ModelPair; permission: BasicPermission }[],
    credentials: BackstageCredentials,
  ): Promise<boolean[]> {
    if (!credentials) throw new Error('Original credentials are required');
    if (!entries.length) return [];
    const decisions = await options.authorizer.authorize(
      entries.map(({ permission }) => ({ permission })),
      { credentials },
    );
    if (!Array.isArray(decisions) || decisions.length !== entries.length) {
      throw new Error('Invalid model permission decisions');
    }
    return decisions.map(decision => decision?.result === 'ALLOW');
  }

  return {
    async canUse(model: ModelPair, credentials: BackstageCredentials) {
      const entry = pairs.get(modelPermissionName(model));
      if (!entry) return false;
      return (await authorize([entry], credentials))[0];
    },
    async listModels(
      credentials: BackstageCredentials,
    ): Promise<readonly ModelPair[]> {
      const entries = [...pairs.values()];
      const decisions = await authorize(entries, credentials);
      return entries.filter((_, i) => decisions[i]).map(entry => entry.model);
    },
    async listProviders(
      credentials: BackstageCredentials,
    ): Promise<readonly string[]> {
      const entries = [...pairs.values()];
      const decisions = await authorize(entries, credentials);
      return [
        ...new Set(
          entries
            .filter((_, i) => decisions[i])
            .map(entry => entry.model.provider),
        ),
      ];
    },
  };
}
