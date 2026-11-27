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

  it('should group links by type in declared order with untyped links first', async () => {
    const links: EntityLink[] = [
      createLink({ url: 'https://jira.com', title: 'Jira Board' }),
      createLink({
        url: 'https://prod.com',
        title: 'Prod web',
        type: 'Prod',
      }),
      createLink({
        url: 'https://prod-grafana.com',
        title: 'Prod grafana',
        type: 'Prod',
      }),
      createLink({
        url: 'https://test.com',
        title: 'Test web',
        type: 'Test',
      }),
      createLink({
        url: 'https://other.com',
        title: 'Untyped second',
        type: '  ',
      }),
    ];

    await renderInTestApp(
      <EntityProvider entity={createEntity(links)}>
        <EntityLinksCard />
      </EntityProvider>,
    );

    const prodHeading = screen.getByRole('heading', {
      level: 4,
      name: 'Prod',
    });
    const testHeading = screen.getByRole('heading', {
      level: 4,
      name: 'Test',
    });

    expect(prodHeading).toBeInTheDocument();
    expect(testHeading).toBeInTheDocument();

    const jiraLink = screen.getByText('Jira Board').closest('a')!;
    const untypedSecondLink = screen.getByText('Untyped second').closest('a')!;
    const prodWebLink = screen.getByText('Prod web').closest('a')!;
    const prodGrafanaLink = screen.getByText('Prod grafana').closest('a')!;
    const testWebLink = screen.getByText('Test web').closest('a')!;

    expect(jiraLink).toBeInTheDocument();
    expect(prodWebLink).toBeInTheDocument();
    expect(prodGrafanaLink).toBeInTheDocument();
    expect(testWebLink).toBeInTheDocument();
    expect(untypedSecondLink).toBeInTheDocument();

    // Verify ordering: untyped first, then Prod section, then Test section
    expect(jiraLink.compareDocumentPosition(prodHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(untypedSecondLink.compareDocumentPosition(prodHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(prodHeading.compareDocumentPosition(prodWebLink)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(prodWebLink.compareDocumentPosition(testHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(testHeading.compareDocumentPosition(testWebLink)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
