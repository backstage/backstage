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

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { MarkdownApiDefinitionWidget } from './MarkdownApiDefinitionWidget';

describe('<MarkdownApiDefinitionWidget />', () => {
  it('renders markdown and trusted html', async () => {
    const rendered = await renderInTestApp(
      <MarkdownApiDefinitionWidget definition="### Its dangerous to go alone! <a>Take this</a>" />,
    );

    expect(
      rendered.getByText('Its dangerous to go alone!', { selector: 'h3' }),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Take this', { selector: 'a' }),
    ).toBeInTheDocument();
  });
});
