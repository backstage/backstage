/*
 * Copyright 2020 The Backstage Authors
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
  BackstageIdentityResponse,
  BackstageUserIdentity,
  ProfileInfo,
} from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types.ts';
import { AuthConnector, PopupOptions } from '../../../../lib';

export type { PopupOptions } from '../../../../lib/AuthConnector';
/**
 * Session information for generic OAuth2 auth.
 *
 * @public
 */
export type OAuth2Session = {
  providerInfo: {
    idToken: string;
    accessToken: string;
    scopes: Set<string>;
    expiresAt?: Date;
  };
  profile: ProfileInfo;
  backstageIdentity?: BackstageIdentityResponse;
};

/**
 * @public
 */
export type OAuth2Response = {
  providerInfo: {
    accessToken: string;
    idToken: string;
    scope: string;
    expiresInSeconds?: number;
  };
  profile: ProfileInfo;
  backstageIdentity: {
    token: string;
    expiresInSeconds?: number;
    identity: BackstageUserIdentity;
  };
};

/**
 * OAuth2 create options.
 * @public
 */
export type OAuth2CreateOptions = OAuthApiCreateOptions & {
  scopeTransform?: (scopes: string[]) => string[];
  popupOptions?: PopupOptions;
};

/**
 * OAuth2 create options with custom auth connector.
 * @public
 */
export type OAuth2CreateOptionsWithAuthConnector = {
  scopeTransform?: (scopes: string[]) => string[];
  defaultScopes?: string[];
  authConnector: AuthConnector<OAuth2Session>;
};
