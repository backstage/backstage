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

import { Response } from 'express';
import crypto from 'crypto';
import { ClientAuthResponse } from '../types';
import { serializeError } from '@backstage/errors';

/**
 * Payload sent as a post message after the auth request is complete.
 * If successful then has a valid payload with Auth information else contains an error.
 *
 * @public
 */
export type WebMessageResponse =
  | {
      type: 'authorization_response';
      response: ClientAuthResponse<unknown>;
    }
  | {
      type: 'authorization_response';
      error: Error;
    };

/** @internal */
export function safelyEncodeURIComponent(value: string): string {
  // Note the g at the end of the regex; all occurrences of single quotes must
  // be replaced, which encodeURIComponent does not do itself by default
  return encodeURIComponent(value).replace(/'/g, '%27');
}

/** @public */
export function sendWebMessageResponse(
  res: Response,
  appOrigin: string,
  response: WebMessageResponse,
): void {
  const jsonData = JSON.stringify(response, (_, value) => {
    if (value instanceof Error) {
      return serializeError(value);
    }
    return value;
  });
  const base64Data = safelyEncodeURIComponent(jsonData);
  const base64Origin = safelyEncodeURIComponent(appOrigin);

  // NOTE: It is absolutely imperative that we use the safe encoder above, to
  // be sure that the js code below does not allow the injection of malicious
  // data.

  // TODO: Make target app origin configurable globally

  //
  // postMessage fails silently if the targetOrigin is disallowed.
  // So 2 postMessages are sent from the popup to the parent window.
  // First, the origin being used to post the actual authorization response is
  // shared with the parent window with a postMessage with targetOrigin '*'.
  // Second, the actual authorization response is sent with the app origin
  // as the targetOrigin.
  // If the first message was received but the actual auth response was
  // never received, the event listener can conclude that targetOrigin
  // was disallowed, indicating potential misconfiguration.
  //
  const script = `
    var authResponse = decodeURIComponent('${base64Data}');
    var origin = decodeURIComponent('${base64Origin}');
    var originInfo = {'type': 'config_info', 'targetOrigin': origin};
    (window.opener || window.parent).postMessage(originInfo, '*');
    (window.opener || window.parent).postMessage(JSON.parse(authResponse), origin);
    setTimeout(() => {
      window.close();
    }, 100); // same as the interval of the core-app-api lib/loginPopup.ts (to address race conditions)
  `;
  const hash = crypto.createHash('sha256').update(script).digest('base64');

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'sameorigin');
  res.setHeader('Content-Security-Policy', `script-src 'sha256-${hash}'`);
  res.end(`<html><body><script>${script}</script></body></html>`);
}
