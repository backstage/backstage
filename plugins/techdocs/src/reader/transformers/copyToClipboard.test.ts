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

import { createTestShadowDom } from '../../test-utils';
import { copyToClipboard } from './copyToClipboard';
import { lightTheme } from '@backstage/theme';
import { act, waitFor } from '@testing-library/react';
import { default as useCopyToClipboardUnmocked } from 'react-use/esm/useCopyToClipboard';

const clipboardSpy = jest.fn();
Object.defineProperty(window.navigator, 'clipboard', {
  value: {
    writeText: clipboardSpy,
  },
});

const useCopyToClipboard = jest.mocked(useCopyToClipboardUnmocked);

jest.mock('react-use/esm/useCopyToClipboard', () =>
  jest.fn().mockImplementation(() => [{ noUserInteraction: false }, jest.fn()]),
);

describe('copyToClipboard', () => {
  it('calls navigator.clipboard.writeText when clipboard button has been clicked', async () => {
    const spy = useCopyToClipboard;
    const copy = jest.fn();
    spy.mockReturnValue([{ noUserInteraction: false }, copy]);

    const expectedClipboard = 'function foo() {return "bar";}';

    let shadowDom: ShadowRoot;
    await act(async () => {
      shadowDom = await createTestShadowDom(
        `
      <!DOCTYPE html>
      <html>
        <body>
          <pre><code><span>${expectedClipboard}</span></code></pre>
        </body>
      </html>
    `,
        {
          preTransformers: [],
          postTransformers: [copyToClipboard(lightTheme)],
        },
      );
    });

    await waitFor(() => {
      expect(shadowDom.querySelector('button')).not.toBe(null);
    });

    await act(async () => {
      shadowDom.querySelector('button')!.click();
    });

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]');
      expect(tooltip).toHaveTextContent('Copied to clipboard');
    });

    expect(copy).toHaveBeenCalledWith(expectedClipboard);
  });

  it('only gets applied to code blocks', async () => {
    const expectedClipboard = 'function foo() {return "bar";}';
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <code><span>${expectedClipboard}</span></code>
        </body>
      </html>
    `,
      {
        preTransformers: [],
        postTransformers: [copyToClipboard(lightTheme)],
      },
    );

    const copyButton = shadowDom.querySelector('button');
    expect(copyButton).toBe(null);
  });
});
