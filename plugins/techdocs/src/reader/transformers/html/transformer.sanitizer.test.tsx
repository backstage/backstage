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

const configApiMock: ConfigApi = new ConfigReader({
  techdocs: {
    sanitizer: {
      allowedCustomElementTagNameRegExp: '^backstage-',
      allowedCustomElementAttributeNameRegExp: 'attribute1|attribute2',
    },
  },
});

const wrapper: FC<PropsWithChildren<{}>> = ({ children }) => (
  <TestApiProvider apis={[[configApiRef, configApiMock]]}>
    {children}
  </TestApiProvider>
);

describe('Transformers > Html > Sanitizer Custom Elements', () => {
  it('should return a function that allows custom elements matching the pattern in the given dom element', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), { wrapper });

    const dirtyDom = document.createElement('html');
    dirtyDom.innerHTML = `
      <body>
        <backstage-element attribute1="test" attribute2></backstage-element>
      </body>
    `;
    const clearDom = await result.current(dirtyDom); // calling html transformer

    const elements = Array.from(
      clearDom.querySelectorAll<HTMLElement>('body > backstage-element'),
    );
    expect(elements).toHaveLength(1);
    expect(elements[0].hasAttribute('attribute1')).toEqual(true);
    expect(elements[0].hasAttribute('attribute2')).toEqual(true);
  });

  it('should return a function that removes custom elements not matching the pattern in the given dom element', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), { wrapper });

    const dirtyDom = document.createElement('html');
    dirtyDom.innerHTML = `
      <body>
        <backstage-element attribute1="test" attribute2></backstage-element>
        <invalid-element attribute1="test" attribute2></invalid-element>
      </body>
    `;
    const clearDom = await result.current(dirtyDom); // calling html transformer

    const elements = Array.from(
      clearDom.querySelectorAll<HTMLElement>('body > backstage-element'),
    );
    expect(elements).toHaveLength(1);
    expect(elements[0].hasAttribute('attribute1')).toEqual(true);
    expect(elements[0].hasAttribute('attribute2')).toEqual(true);
  });

  it('should return a function that removes custom element attributes not matching the pattern in the given dom element', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), { wrapper });

    const dirtyDom = document.createElement('html');
    dirtyDom.innerHTML = `
      <body>
        <backstage-element attribute1="test" attribute2></backstage-element>
        <backstage-element attribute3="test" attribute4></backstage-element>
      </body>
    `;
    const clearDom = await result.current(dirtyDom); // calling html transformer

    const elements = Array.from(
      clearDom.querySelectorAll<HTMLElement>('body > backstage-element'),
    );
    expect(elements).toHaveLength(2);
    expect(elements[0].hasAttribute('attribute1')).toEqual(true);
    expect(elements[0].hasAttribute('attribute2')).toEqual(true);
    expect(elements[1].hasAttribute('attribute3')).toEqual(false);
    expect(elements[1].hasAttribute('attribute4')).toEqual(false);
  });

  it('should retain the dominant baseline attribute for svgs', async () => {
    const { result } = renderHook(() => useSanitizerTransformer(), { wrapper });

    const dirtyDom = document.createElement('html');
    dirtyDom.innerHTML = `
      <body>
        <?xml version="1.0" encoding="utf-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="141.253 134.456 199.764 63.239" width="199.764px" height="63.239px">
          <rect x="141.253" y="134.456" width="199.764" height="63.239" fill="grey" transform="matrix(1, 0, 0, 1, 7.105427357601002e-15, 3.552713678800501e-15)"/>
          <text dominant-baseline="text-before-edge" style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 28px;" x="223.404" y="148.64" transform="matrix(1, 0, 0, 1, 7.105427357601002e-15, 3.552713678800501e-15)">Hej</text>
        </svg>
      </body>
    `;
    const clearDom = await result.current(dirtyDom);

    const elements = Array.from(clearDom.querySelectorAll<HTMLElement>('text'));

    expect(elements).toHaveLength(1);
    expect(elements[0].hasAttribute('dominant-baseline')).toBe(true);
  });
});
