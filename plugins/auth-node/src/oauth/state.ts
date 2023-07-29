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

import pickBy from 'lodash/pickBy';
import { Request } from 'express';

/** @public */
export type OAuthState = {
  /* A type for the serialized value in the `state` parameter of the OAuth authorization flow
   */
  nonce: string;
  env: string;
  origin?: string;
  scope?: string;
  redirectUrl?: string;
  flow?: string;
};

/** @public */
export type OAuthStateTransform = (
  state: OAuthState,
  context: { req: Request },
) => Promise<{ state: OAuthState }>;

/** @public */
export function encodeOAuthState(state: OAuthState): string {
  const stateString = new URLSearchParams(
    pickBy<string>(state, value => value !== undefined),
  ).toString();

  return Buffer.from(stateString, 'utf-8').toString('hex');
}

/** @public */
export function decodeOAuthState(encodedState: string): OAuthState {
  const state = Object.fromEntries(
    new URLSearchParams(Buffer.from(encodedState, 'hex').toString('utf-8')),
  );
  if (
    !state.nonce ||
    !state.env ||
    state.nonce?.length === 0 ||
    state.env?.length === 0
  ) {
    throw Error(`Invalid state passed via request`);
  }

  return state as OAuthState;
}
