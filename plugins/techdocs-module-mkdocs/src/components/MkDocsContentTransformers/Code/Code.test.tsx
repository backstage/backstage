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

// the import order matters, should be the first
import { createDom } from '../../../test-utils';

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { TechDocsShadowDomProvider } from '@backstage/plugin-techdocs';

import { CodeTransformer } from '.';

const code = 'function foo() {return "bar";}';

describe('Code', () => {
  const { navigator } = window;

  beforeAll(() => {
    jest.clearAllMocks();
    // @ts-ignore
    delete window.navigator;
    // @ts-ignore
    window.navigator = { clipboard: { writeText: jest.fn() } };
  });

  afterAll(() => {
    window.navigator = navigator;
  });

  it('Should copy text to cliboard when clicked', async () => {
    const dom = createDom(
      <body>
        <pre>
          <code>{code}</code>
        </pre>
      </body>,
    );

    expect(dom.querySelector('button')).toBeNull();

    render(
      <TechDocsShadowDomProvider dom={dom}>
        <CodeTransformer />
      </TechDocsShadowDomProvider>,
    );

    fireEvent.click(dom.querySelector('button')!);

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]');
      expect(tooltip).toHaveTextContent('Copied to clipboard');
    });

    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(code);
  });
});
