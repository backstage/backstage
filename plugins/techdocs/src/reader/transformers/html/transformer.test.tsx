/*
 * Copyright 2022 The Backstage Authors
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

import React, { FC } from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { ConfigReader } from '@backstage/core-app-api';
import { ConfigApi, configApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';

import { useSanitizerTransformer } from './transformer';

const configApiMock: ConfigApi = new ConfigReader({
  techdocs: {
    sanitizer: {
      allowedIframeHosts: ['docs.google.com'],
    },
  },
});

const wrapper: FC = ({ children }) => (
  <TestApiProvider apis={[[configApiRef, configApiMock]]}>
    {children}
  </TestApiProvider>
);

describe('Transformers > Html', () => {
  it('should return a function that removes unsafe links from a given dom element', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), { wrapper });

    const dirtyDom = document.createElement('html');
    dirtyDom.innerHTML = `
      <head>
        <link src="http://unsafe-host.com"/>
        <link rel="stylesheet" href="assets/stylesheets/main.50e68009.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,700%7CRoboto+Mono&display=fallback">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      </head>
    `;
    const clearDom = await result.current(dirtyDom); // calling html transformer

    const links = Array.from(
      clearDom.querySelectorAll<HTMLLinkElement>('head > link'),
    );
    expect(links).toHaveLength(3);
    expect(links[0].href).toMatch('assets/stylesheets/main.50e68009.min.css');
    expect(links[1].href).toMatch('https://fonts.googleapis.com');
    expect(links[2].href).toMatch('https://fonts.gstatic.com');
  });

  it('should return a function that removes unsafe iframes from a given dom element', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), { wrapper });

    const dirtyDom = document.createElement('html');
    dirtyDom.innerHTML = `
        <body>
          <iframe src="invalid"></iframe>
          <iframe src="http://unsafe-host.com"></iframe>
          <iframe src="https://docs.google.com/document/d/1fQ7SayGdQ7Sa"></iframe>
        </body>
      `;
    const clearDom = await result.current(dirtyDom); // calling html transformer

    const iframes = Array.from(
      clearDom.querySelectorAll<HTMLIFrameElement>('body > iframe'),
    );

    expect(iframes).toHaveLength(1);
    expect(iframes[0].src).toMatch('docs.google.com');
  });
});
