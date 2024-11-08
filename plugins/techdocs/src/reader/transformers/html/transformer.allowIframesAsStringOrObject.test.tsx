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

import React, { FC, PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';

import { ConfigReader } from '@backstage/core-app-api';
import { ConfigApi, configApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';

import { useSanitizerTransformer } from './transformer';

const configApiMockAsStringArray: ConfigApi = new ConfigReader({
  techdocs: {
    sanitizer: {
      allowedIframeHosts: ['docs.google.com'],
    },
  },
});
const configApiMockAsObjectArray: ConfigApi = new ConfigReader({
  techdocs: {
    sanitizer: {
      allowedIframeHosts: [
        {
          src: 'docs.google.com',
        },
      ],
    },
  },
});

const stringWrapper: FC<PropsWithChildren<{}>> = ({ children }) => (
  <TestApiProvider apis={[[configApiRef, configApiMockAsStringArray]]}>
    {children}
  </TestApiProvider>
);

const objectWrapper: FC<PropsWithChildren<{}>> = ({ children }) => (
  <TestApiProvider apis={[[configApiRef, configApiMockAsObjectArray]]}>
    {children}
  </TestApiProvider>
);

describe('Transformers > Html > Sanitizer', () => {
  it('should allow a config of just string sources', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), {
      wrapper: stringWrapper,
    });

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

  it('should allow a config of complex object sources', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), {
      wrapper: objectWrapper,
    });

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
