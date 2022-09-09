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

import express from 'express';
import { OAuthState } from './types';
import pickBy from 'lodash/pickBy';
import { CookieConfigurer } from '../../providers/types';

/** @public */
export const readState = (stateString: string): OAuthState => {
  const state = Object.fromEntries(
    new URLSearchParams(Buffer.from(stateString, 'hex').toString('utf-8')),
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
};

/** @public */
export const encodeState = (state: OAuthState): string => {
  const stateString = new URLSearchParams(
    pickBy<string>(state, value => value !== undefined),
  ).toString();

  return Buffer.from(stateString, 'utf-8').toString('hex');
};

/** @public */
export const verifyNonce = (req: express.Request, providerId: string) => {
  const cookieNonce = req.cookies[`${providerId}-nonce`];
  const state: OAuthState = readState(req.query.state?.toString() ?? '');
  const stateNonce = state.nonce;

  if (!cookieNonce) {
    throw new Error('Auth response is missing cookie nonce');
  }
  if (stateNonce.length === 0) {
    throw new Error('Auth response is missing state nonce');
  }
  if (cookieNonce !== stateNonce) {
    throw new Error('Invalid nonce');
  }
};

export const defaultCookieConfigurer: CookieConfigurer = ({
  callbackUrl,
  providerId,
  appOrigin,
}) => {
  const { hostname: domain, pathname, protocol } = new URL(callbackUrl);
  const secure = protocol === 'https:';

  // For situations where the auth-backend is running on a
  // different domain than the app, we set the SameSite attribute
  // to 'none' to allow third-party access to the cookie, but
  // only if it's in a secure context (https).
  let sameSite: ReturnType<CookieConfigurer>['sameSite'] = 'lax';
  if (new URL(appOrigin).hostname !== domain && secure) {
    sameSite = 'none';
  }

  // If the provider supports callbackUrls, the pathname will
  // contain the complete path to the frame handler so we need
  // to slice off the trailing part of the path.
  const path = pathname.endsWith(`${providerId}/handler/frame`)
    ? pathname.slice(0, -'/handler/frame'.length)
    : `${pathname}/${providerId}`;

  return { domain, path, secure, sameSite };
};
