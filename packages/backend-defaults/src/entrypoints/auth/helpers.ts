/*
 * Copyright 2024 The Backstage Authors
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

import {
  BackstageCredentials,
  BackstageNonePrincipal,
  BackstagePrincipalAccessRestrictions,
  BackstageServicePrincipal,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';
import { InternalBackstageCredentials } from './types';
import { createHash } from 'crypto';

export function createCredentialsWithServicePrincipal(
  sub: string,
  token?: string,
  accessRestrictions?: BackstagePrincipalAccessRestrictions,
): InternalBackstageCredentials<BackstageServicePrincipal> {
  const principal = createServicePrincipal(sub, accessRestrictions);
  const result = {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    principal,
  } as const;
  Object.defineProperties(result, {
    token: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: token,
    },
    toString: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: () => `backstageCredentials{${principal}}`,
    },
  });
  return result;
}

export function createCredentialsWithUserPrincipal(
  sub: string,
  token: string,
  expiresAt?: Date,
  actor?: string,
): InternalBackstageCredentials<BackstageUserPrincipal> {
  const principal = createUserPrincipal(
    sub,
    actor ? createServicePrincipal(actor) : undefined,
  );
  const result = {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    expiresAt,
    principal,
  } as const;
  Object.defineProperties(result, {
    token: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: token,
    },
    toString: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: () => `backstageCredentials{${principal}}`,
    },
  });
  return result;
}

export function createCredentialsWithNonePrincipal(): InternalBackstageCredentials<BackstageNonePrincipal> {
  const principal = createNonePrincipal();
  const result = {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    principal,
  } as const;
  Object.defineProperties(result, {
    toString: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: () => `backstageCredentials{${principal}}`,
    },
  });
  return result;
}

export function toInternalBackstageCredentials(
  credentials: BackstageCredentials,
): InternalBackstageCredentials<
  BackstageUserPrincipal | BackstageServicePrincipal | BackstageNonePrincipal
> {
  if (credentials.$$type !== '@backstage/BackstageCredentials') {
    throw new Error('Invalid credential type');
  }

  const internalCredentials = credentials as InternalBackstageCredentials<
    BackstageUserPrincipal | BackstageServicePrincipal | BackstageNonePrincipal
  >;

  if (internalCredentials.version !== 'v1') {
    throw new Error(
      `Invalid credential version ${internalCredentials.version}`,
    );
  }

  return internalCredentials;
}

function createServicePrincipal(
  sub: string,
  accessRestrictions?: BackstagePrincipalAccessRestrictions,
): BackstageServicePrincipal {
  const result = {
    type: 'service',
    subject: sub,
    accessRestrictions,
  } as const;
  Object.defineProperties(result, {
    toString: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: () => {
        let parts = sub;
        if (accessRestrictions) {
          const hash = createHash('sha256')
            .update(JSON.stringify(accessRestrictions))
            .digest('base64')
            .replace(/=+$/, '');
          parts += `,accessRestrictions=${hash}`;
        }
        return `servicePrincipal{${parts}}`;
      },
    },
  });
  return result;
}

function createUserPrincipal(
  userEntityRef: string,
  actor?: BackstageServicePrincipal,
): BackstageUserPrincipal {
  const result = {
    type: 'user',
    userEntityRef,
    actor,
  } as const;
  Object.defineProperties(result, {
    toString: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: () => {
        let parts = userEntityRef;
        if (actor) {
          parts += `,actor={${actor}}`;
        }
        return `userPrincipal{${parts}}`;
      },
    },
  });
  return result;
}

function createNonePrincipal(): BackstageNonePrincipal {
  const result = {
    type: 'none',
  } as const;
  Object.defineProperties(result, {
    toString: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: () => 'nonePrincipal',
    },
  });
  return result;
}
