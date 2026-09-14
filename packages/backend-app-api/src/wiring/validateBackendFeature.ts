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

import { InputError } from '@backstage/errors';
// Direct internal import to avoid duplication
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type {
  InternalBackendFeatureLoader,
  InternalBackendRegistrations,
} from '../../../backend-plugin-api/src/wiring/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { InternalServiceFactory } from '../../../backend-plugin-api/src/services/system/types';

export type ValidatedBackendFeature =
  | { type: 'service'; feature: InternalServiceFactory }
  | { type: 'loader'; feature: InternalBackendFeatureLoader }
  | { type: 'registrations'; feature: InternalBackendRegistrations };

function describeValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }
  if (typeof value === 'function') {
    return 'a function';
  }
  if (Array.isArray(value)) {
    return 'an array';
  }
  return 'an object';
}

export function throwInvalidBackendFeature(
  path: string,
  expected: string,
  value: unknown,
): never {
  throw new InputError(
    `Invalid backend feature at ${path}, expected ${expected}, received ${describeValue(
      value,
    )}`,
  );
}

export function assertObject(
  value: unknown,
  path: string,
  expected = 'an object',
): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throwInvalidBackendFeature(path, expected, value);
  }
}

export function assertObjectLike(
  value: unknown,
  path: string,
): asserts value is Record<string, unknown> {
  if (
    (typeof value !== 'object' || value === null) &&
    typeof value !== 'function'
  ) {
    throwInvalidBackendFeature(path, 'an object or function', value);
  }
}

export function assertString(
  value: unknown,
  path: string,
): asserts value is string {
  if (typeof value !== 'string') {
    throwInvalidBackendFeature(path, 'a string', value);
  }
}

export function assertFunction(
  value: unknown,
  path: string,
): asserts value is (...args: any[]) => unknown {
  if (typeof value !== 'function') {
    throwInvalidBackendFeature(path, 'a function', value);
  }
}

export function assertArray(
  value: unknown,
  path: string,
): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throwInvalidBackendFeature(path, 'an array', value);
  }
}

export function validateServiceRef(value: unknown, path: string): void {
  assertObject(value, path, 'a service reference object');
  assertString(value.id, `${path}.id`);
  if (value.scope !== 'root' && value.scope !== 'plugin') {
    throwInvalidBackendFeature(
      `${path}.scope`,
      '"root" or "plugin"',
      value.scope,
    );
  }
}

export function validateExtensionPoint(value: unknown, path: string): void {
  assertObject(value, path, 'an extension point reference object');
  assertString(value.id, `${path}.id`);
}

/**
 * Reads the registrations from a backend feature and validates the outer
 * registration objects and their identifying fields.
 *
 * Nested registration data is validated later by
 * {@link validateBackendRegistration}, when each registration is enumerated.
 */
export function validateBackendRegistrations(
  feature: InternalBackendRegistrations,
  source: string,
): ReturnType<InternalBackendRegistrations['getRegistrations']> {
  assertFunction(feature.getRegistrations, `${source}.getRegistrations`);
  const registrations: unknown = feature.getRegistrations();
  assertArray(registrations, `${source}.getRegistrations()`);

  for (let index = 0; index < registrations.length; index++) {
    const path = `${source}.getRegistrations()[${index}]`;
    const registration = registrations[index];
    assertObject(registration, path, 'a registration object');

    if (
      registration.type === 'plugin' ||
      registration.type === 'module' ||
      registration.type === 'plugin-v1.1' ||
      registration.type === 'module-v1.1'
    ) {
      assertString(registration.pluginId, `${path}.pluginId`);
    }
    if (registration.type === 'module' || registration.type === 'module-v1.1') {
      const modulePath =
        typeof registration.pluginId === 'string'
          ? `module registration for plugin ${JSON.stringify(
              registration.pluginId,
            )}`
          : path;
      assertString(registration.moduleId, `${modulePath}.moduleId`);
    }
  }

  return registrations as ReturnType<
    InternalBackendRegistrations['getRegistrations']
  >;
}

/**
 * Validates the nested extension point and dependency data consumed while a
 * single plugin or module registration is enumerated.
 *
 * The registration object and its identifying fields have already been
 * validated by {@link validateBackendRegistrations}. Duplicate and conflicting
 * registrations are handled separately by the backend initializer.
 */
export function validateBackendRegistration(
  registration: ReturnType<
    InternalBackendRegistrations['getRegistrations']
  >[number],
): void {
  let registrationPath = 'registration';
  if ('moduleId' in registration) {
    registrationPath = `module ${JSON.stringify(
      registration.moduleId,
    )} for plugin ${JSON.stringify(registration.pluginId)}`;
  } else if ('pluginId' in registration) {
    registrationPath = `plugin ${JSON.stringify(registration.pluginId)}`;
  }

  if (registration.type === 'plugin' || registration.type === 'module') {
    assertArray(
      registration.extensionPoints,
      `${registrationPath}.extensionPoints`,
    );
    for (let index = 0; index < registration.extensionPoints.length; index++) {
      const itemPath = `${registrationPath}.extensionPoints[${index}]`;
      const item: unknown = registration.extensionPoints[index];
      assertArray(item, itemPath);
      validateExtensionPoint(item[0], `${itemPath}[0]`);
    }
  } else if (
    registration.type === 'plugin-v1.1' ||
    registration.type === 'module-v1.1'
  ) {
    assertArray(
      registration.extensionPoints,
      `${registrationPath}.extensionPoints`,
    );
    for (let index = 0; index < registration.extensionPoints.length; index++) {
      const itemPath = `${registrationPath}.extensionPoints[${index}]`;
      const item: unknown = registration.extensionPoints[index];
      assertObject(item, itemPath, 'an extension point registration object');
      validateExtensionPoint(item.extensionPoint, `${itemPath}.extensionPoint`);
    }
  }

  if (
    registration.type === 'plugin' ||
    registration.type === 'module' ||
    registration.type === 'plugin-v1.1' ||
    registration.type === 'module-v1.1'
  ) {
    assertObject(
      registration.init,
      `${registrationPath}.init`,
      'an init registration object',
    );
    assertObject(
      registration.init.deps,
      `${registrationPath}.init.deps`,
      'a dependency object',
    );
    for (const [name, ref] of Object.entries(registration.init.deps)) {
      const path = `${registrationPath}.init.deps.${name}`;
      if (
        (registration.type === 'module' ||
          registration.type === 'module-v1.1') &&
        typeof ref === 'object' &&
        ref !== null &&
        (ref as { $$type?: unknown }).$$type === '@backstage/ExtensionPoint'
      ) {
        validateExtensionPoint(ref, path);
      } else {
        validateServiceRef(ref, path);
      }
    }
  }
}

export function describeBackendFeature(value: unknown): string | undefined {
  if (
    (typeof value !== 'object' || value === null) &&
    typeof value !== 'function'
  ) {
    return undefined;
  }

  const feature = value as Record<string, unknown>;
  const service = feature.service;
  if (typeof service === 'object' && service !== null && 'id' in service) {
    const serviceId = service.id;
    if (typeof serviceId === 'string') {
      return `service factory for ${JSON.stringify(serviceId)}`;
    }
  }

  if (
    feature.featureType === 'loader' &&
    typeof feature.description === 'string'
  ) {
    return `feature loader ${feature.description}`;
  }

  if (typeof feature.description === 'string') {
    return `backend feature ${feature.description}`;
  }

  return undefined;
}

export function validateBackendFeature(
  value: unknown,
  path: string,
): ValidatedBackendFeature {
  assertObjectLike(value, path);
  if (value.$$type !== '@backstage/BackendFeature') {
    throwInvalidBackendFeature(
      `${path}.$$type`,
      '"@backstage/BackendFeature"',
      value.$$type,
    );
  }
  if (value.version !== 'v1') {
    throwInvalidBackendFeature(`${path}.version`, '"v1"', value.version);
  }

  if (value.featureType === 'service' || 'service' in value) {
    return {
      type: 'service',
      feature: value as unknown as InternalServiceFactory,
    };
  }
  if (value.featureType === 'loader') {
    return {
      type: 'loader',
      feature: value as unknown as InternalBackendFeatureLoader,
    };
  }
  if (value.featureType === 'registrations' || 'getRegistrations' in value) {
    return {
      type: 'registrations',
      feature: value as unknown as InternalBackendRegistrations,
    };
  }

  return throwInvalidBackendFeature(
    `${path}.featureType`,
    '"service", "registrations", or "loader"',
    value.featureType,
  );
}
