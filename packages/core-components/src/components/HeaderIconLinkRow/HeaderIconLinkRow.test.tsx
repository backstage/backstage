/*
 * Copyright 2026 The Backstage Authors
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

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HeaderIconLinkRow } from './HeaderIconLinkRow';
import { IconLinkVertical } from './IconLinkVertical';

describe('HeaderIconLinkRow', () => {
  it('renders links from props together with custom link elements', () => {
    render(
      <MemoryRouter>
        <HeaderIconLinkRow links={[{ label: 'Prop link', href: '/prop' }]}>
          <IconLinkVertical label="Child link" href="/child" />
        </HeaderIconLinkRow>
      </MemoryRouter>,
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Prop link' })).toHaveAttribute(
      'href',
      '/prop',
    );
    expect(screen.getByRole('link', { name: 'Child link' })).toHaveAttribute(
      'href',
      '/child',
    );
  });
});
