/*
 * Copyright 2020 Spotify AB
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
import crypto from 'crypto';
import { WebMessageResponse } from './types';

export const safelyEncodeURIComponent = (value: string) => {
  // Note the g at the end of the regex; all occurrences of single quotes must
  // be replaced, which encodeURIComponent does not do itself by default
  return encodeURIComponent(value).replace(/'/g, '%27');
};

export const postMessageResponse = (
  res: express.Response,
  appOrigin: string,
  response: WebMessageResponse,
) => {
  const jsonData = JSON.stringify(response);
  const base64Data = safelyEncodeURIComponent(jsonData);
  const base64Origin = safelyEncodeURIComponent(appOrigin);

  // NOTE: It is absolutely imperative that we use the safe encoder above, to
  // be sure that the js code below does not allow the injection of malicious
  // data.

  // TODO: Make target app origin configurable globally
  const script = `
    var json = decodeURIComponent('${base64Data}');
    var origin = decodeURIComponent('${base64Origin}');
    (window.opener || window.parent).postMessage(JSON.parse(json), origin);
    window.close();
  `;
  const hash = crypto.createHash('sha256').update(script).digest('base64');

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'sameorigin');
  res.setHeader('Content-Security-Policy', `script-src 'sha256-${hash}'`);
  res.end(`<html><body><script>${script}</script></body></html>`);
};

export const ensuresXRequestedWith = (req: express.Request) => {
  const requiredHeader = req.header('X-Requested-With');
  if (!requiredHeader || requiredHeader !== 'XMLHttpRequest') {
    return false;
  }
  return true;
};
