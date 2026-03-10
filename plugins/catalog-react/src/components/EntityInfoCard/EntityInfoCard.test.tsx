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

import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { EntityInfoCard } from './EntityInfoCard';

describe('<EntityInfoCard />', () => {
  it('renders children in the card body', async () => {
    await renderInTestApp(
      <EntityInfoCard>
        <div>Body content</div>
      </EntityInfoCard>,
    );

    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders the title when provided', async () => {
    await renderInTestApp(
      <EntityInfoCard title="My Card Title">
        <div>Body</div>
      </EntityInfoCard>,
    );

    expect(
      screen.getByRole('heading', { name: 'My Card Title' }),
    ).toBeInTheDocument();
  });

  it('does not render a heading when title is not provided', async () => {
    await renderInTestApp(
      <EntityInfoCard>
        <div>Body</div>
      </EntityInfoCard>,
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders header actions next to the title', async () => {
    await renderInTestApp(
      <EntityInfoCard title="Title" headerActions={<button>Edit</button>}>
        <div>Body</div>
      </EntityInfoCard>,
    );

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders footer actions when provided', async () => {
    await renderInTestApp(
      <EntityInfoCard title="Title" footerActions={<button>Next Page</button>}>
        <div>Body</div>
      </EntityInfoCard>,
    );

    expect(
      screen.getByRole('button', { name: 'Next Page' }),
    ).toBeInTheDocument();
  });

  it('does not render footer when footerActions is not provided', async () => {
    const { container } = await renderInTestApp(
      <EntityInfoCard title="Title">
        <div>Body</div>
      </EntityInfoCard>,
    );

    expect(container.querySelector('.bui-CardFooter')).not.toBeInTheDocument();
  });

  it('renders JSX titles (e.g., icon + text)', async () => {
    await renderInTestApp(
      <EntityInfoCard
        title={
          <span>
            <span aria-hidden>🏠</span> Home Card
          </span>
        }
      >
        <div>Body</div>
      </EntityInfoCard>,
    );

    expect(screen.getByText('Home Card')).toBeInTheDocument();
  });
});
