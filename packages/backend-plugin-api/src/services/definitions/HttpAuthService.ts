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

import { Request, Response } from 'express';
import {
  BackstageCredentials,
  BackstageServicePrincipal,
  BackstageNonePrincipal,
  BackstageUserPrincipal,
} from './AuthService';

/** @public */
export type BackstageHttpAccessToPrincipalTypesMapping = {
  user: BackstageUserPrincipal;
  'user-cookie': BackstageUserPrincipal;
  service: BackstageServicePrincipal;
  unauthenticated: BackstageNonePrincipal;
};

/** @public */
export interface HttpAuthService {
  credentials<
    TAllowed extends
      | keyof BackstageHttpAccessToPrincipalTypesMapping
      | undefined = undefined,
  >(
    req: Request,
    options?: {
      allow: Array<TAllowed>;
    },
  ): Promise<
    BackstageCredentials<
      TAllowed extends keyof BackstageHttpAccessToPrincipalTypesMapping
        ? BackstageHttpAccessToPrincipalTypesMapping[TAllowed]
        : unknown
    >
  >;

  requestHeaders(options?: {
    forward?: BackstageCredentials;
  }): Promise<Record<string, string>>;

  issueUserCookie(res: Response): Promise<void>;
}
