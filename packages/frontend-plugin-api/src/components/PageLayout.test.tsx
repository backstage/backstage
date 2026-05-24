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

import { render, screen } from '@testing-library/react';
import { PageLayout } from './PageLayout';

describe('PageLayout', () => {
  const tabs = [{ id: 'one', label: 'Tab One', href: '/one' }];

  it('renders the header with the title and tabs by default', async () => {
    render(
      <PageLayout title="My Title" tabs={tabs}>
        <div>Page content</div>
      </PageLayout>,
    );

    expect(await screen.findByText('Page content')).toBeInTheDocument();
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(screen.getByText('Tab One')).toBeInTheDocument();
  });

  it('hides the header, title and tabs when noHeader is set', async () => {
    render(
      <PageLayout title="My Title" tabs={tabs} noHeader>
        <div>Page content</div>
      </PageLayout>,
    );

    expect(await screen.findByText('Page content')).toBeInTheDocument();
    expect(screen.queryByText('My Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Tab One')).not.toBeInTheDocument();
  });
});
