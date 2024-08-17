/*
 * Copyright 2024 The Backstage Authors
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
import { TemplatingExample } from '@backstage/plugin-scaffolder-react';
import { renderInTestApp } from '@backstage/test-utils';
import { within } from '@testing-library/react';
import React from 'react';
import { ExamplesTable } from './ExamplesTable';

describe('examples', () => {
  it('renders component', async () => {
    const examples: TemplatingExample[] = [
      {
        description: 'foo',
        example: 'bar',
      },
      {
        description: 'baz',
        example: 'blah',
      },
    ];
    const { getByTestId } = await renderInTestApp(
      <ExamplesTable {...{ examples }} />,
    );
    const x = getByTestId('examples');
    expect(x).toBeInTheDocument();
    const wx = within(x);

    for (const [index, value] of examples.entries()) {
      const d = wx.getByTestId(`example_desc${index}`);
      expect(d).toBeInTheDocument();
      expect(d.textContent).toBe(value.description);
      const c = wx.getByTestId(`example_code${index}`);
      expect(c).toBeInTheDocument();
      expect(within(c).getByText(value.example)).toBeInTheDocument();
    }
  });
});
