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

import { Entity, EntityLink } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { EntityLinksCard } from './EntityLinksCard';

describe('EntityLinksCard', () => {
  const createEntity = (links: EntityLink[] = []): Entity =>
    ({
      metadata: {
        name: 'mock',
        links,
      },
      kind: 'MockKind',
    } as Entity);

  const createLink = ({
    url = 'https://dashboard.dashexample.com',
    title = 'admin dashboard',
    icon = undefined,
    type = undefined,
  }: Partial<EntityLink> = {}): EntityLink => ({
    url,
    title,
    icon,
    type,
  });

  it('should render a link', async () => {
    const links: EntityLink[] = [createLink()];

    await renderInTestApp(
      <EntityProvider entity={createEntity(links)}>
        <EntityLinksCard />
      </EntityProvider>,
    );

    expect(screen.getByText('admin dashboard')).toBeInTheDocument();
    expect(screen.queryByText('derp')).not.toBeInTheDocument();
  });

  it('should show empty state', async () => {
    await renderInTestApp(
      <EntityProvider entity={createEntity([])}>
        <EntityLinksCard />
      </EntityProvider>,
    );

    expect(
      screen.getByText(/.*No links defined for this entity.*/),
    ).toBeInTheDocument();
    expect(screen.queryByText('admin dashboard')).not.toBeInTheDocument();
  });

  it('should render type group headings when links have a type', async () => {
    const links: EntityLink[] = [
      createLink({ title: 'Prod Dashboard', type: 'prod' }),
      createLink({
        url: 'https://staging.example.com',
        title: 'Staging Dashboard',
        type: 'staging',
      }),
    ];

    await renderInTestApp(
      <EntityProvider entity={createEntity(links)}>
        <EntityLinksCard />
      </EntityProvider>,
    );

    expect(screen.getByText('prod')).toBeInTheDocument();
    expect(screen.getByText('staging')).toBeInTheDocument();
    expect(screen.getByText('Prod Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Staging Dashboard')).toBeInTheDocument();
  });

  it('should render ungrouped links before typed groups', async () => {
    const links: EntityLink[] = [
      createLink({ title: 'Generic Link' }),
      createLink({ title: 'Prod Link', type: 'prod' }),
    ];

    await renderInTestApp(
      <EntityProvider entity={createEntity(links)}>
        <EntityLinksCard />
      </EntityProvider>,
    );

    expect(screen.getByText('Generic Link')).toBeInTheDocument();
    expect(screen.getByText('prod')).toBeInTheDocument();
    expect(screen.getByText('Prod Link')).toBeInTheDocument();
  });
});
