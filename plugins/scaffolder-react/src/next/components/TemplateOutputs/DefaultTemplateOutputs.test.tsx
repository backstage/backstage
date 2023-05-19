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

import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { DefaultTemplateOutputs } from '.';

describe('<DefaultTemplateOutputs />', () => {
  it('should render template output', async () => {
    const output = {
      links: [{ title: 'Link 1', url: 'https://backstage.io/' }],
      text: [{ title: 'Text 1', content: 'Hello, **world**!' }],
    };

    const { getByRole } = await renderInTestApp(
      <DefaultTemplateOutputs output={output} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // test link outputs
    for (const link of output.links ?? []) {
      expect(
        getByRole('button', { name: link.title }).closest('a'),
      ).toHaveAttribute('href', link.url);
    }

    // test text outputs
    for (const text of output.text ?? []) {
      await act(async () => {
        fireEvent.click(getByRole('button', { name: text.title }));
      });

      expect(getByRole('heading', { level: 2 }).innerHTML).toBe(text.title);
    }
  });
});
