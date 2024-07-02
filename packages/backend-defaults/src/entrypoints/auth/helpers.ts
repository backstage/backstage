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

export function createCredentialsWithServicePrincipal(
  sub: string,
  token?: string,
  accessRestrictions?: BackstagePrincipalAccessRestrictions,
): InternalBackstageCredentials<BackstageServicePrincipal> {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    token,
    principal: {
      type: 'service',
      subject: sub,
      accessRestrictions,
    },
  };
}

export function createCredentialsWithUserPrincipal(
  sub: string,
  token: string,
  expiresAt?: Date,
): InternalBackstageCredentials<BackstageUserPrincipal> {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    token,
    expiresAt,
    principal: {
      type: 'user',
      userEntityRef: sub,
    },
  };
}

export function createCredentialsWithNonePrincipal(): InternalBackstageCredentials<BackstageNonePrincipal> {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    principal: {
      type: 'none',
    },
  };
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
