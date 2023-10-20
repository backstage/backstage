/*
 * Copyright 2023 The Backstage Authors
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

import { Config } from '@backstage/config';
import { Request } from 'express';
import { ProfileTransform } from '../types';

/** @public */
export interface ProxyAuthenticator<TContext, TResult> {
  defaultProfileTransform: ProfileTransform<TResult>;
  initialize(ctx: { config: Config }): TContext;
  authenticate(
    options: { req: Request },
    ctx: TContext,
  ): Promise<{ result: TResult }>;
}

/** @public */
export function createProxyAuthenticator<TContext, TResult>(
  authenticator: ProxyAuthenticator<TContext, TResult>,
): ProxyAuthenticator<TContext, TResult> {
  return authenticator;
}
