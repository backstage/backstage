/*
 * Copyright 2021 The Backstage Authors
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

import { JsonValue } from '@backstage/types';
import { AuthResponse } from '../types';

/**
 * The header name used by the IAP.
 */
export const IAP_JWT_HEADER = 'x-goog-iap-jwt-assertion';

/**
 * The data extracted from an IAP token.
 *
 * @public
 */
export type GcpIapTokenInfo = {
  /**
   * The unique, stable identifier for the user.
   */
  sub: string;
  /**
   * User email address.
   */
  email: string;
  /**
   * Other fields.
   */
  [key: string]: JsonValue;
};

/**
 * The result of the initial auth challenge. This is the input to the auth
 * callbacks.
 *
 * @public
 */
export type GcpIapResult = {
  /**
   * The data extracted from the IAP token header.
   */
  iapToken: GcpIapTokenInfo;
};

/**
 * The provider info to return to the frontend.
 */
export type GcpIapProviderInfo = {
  /**
   * The data extracted from the IAP token header.
   */
  iapToken: GcpIapTokenInfo;
};

/**
 * The shape of the response to return to callers.
 */
export type GcpIapResponse = AuthResponse<GcpIapProviderInfo>;
