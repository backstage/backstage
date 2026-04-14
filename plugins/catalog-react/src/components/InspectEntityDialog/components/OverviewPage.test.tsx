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
import { entityRouteRef } from '../../../routes';
import { OverviewPage } from './OverviewPage';

const mountedRoutes = {
  '/catalog/:namespace/:kind/:name/*': entityRouteRef,
};

const entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    namespace: 'default',
    name: 'test-component',
    uid: 'test-uid-123',
    etag: 'test-etag-456',
    annotations: {
      'backstage.io/source-location': 'url:https://github.com/example/repo',
      'backstage.io/techdocs-ref': 'dir:.',
    },
    labels: {
      'backstage.io/custom': 'value',
    },
    tags: ['java', 'data'],
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
    owner: 'team-a',
  },
  relations: [
    { type: 'ownedBy', targetRef: 'group:default/team-a' },
    { type: 'ownedBy', targetRef: 'group:default/team-b' },
    { type: 'dependsOn', targetRef: 'component:default/other' },
  ],
} as any;

describe('OverviewPage', () => {
  it('renders identity key-value pairs', async () => {
    await renderInTestApp(<OverviewPage entity={entity} />, { mountedRoutes });

    const terms = screen.getAllByRole('term');
    const definitions = screen.getAllByRole('definition');
    const termTexts = terms.map(el => el.textContent);

    expect(termTexts).toContain('apiVersion');
    expect(termTexts).toContain('kind');
    expect(termTexts).toContain('uid');
    expect(termTexts).toContain('etag');
    expect(termTexts).toContain('entityRef');

    const defTexts = definitions.map(el => el.textContent);
    expect(defTexts).toContain('backstage.io/v1alpha1');
    expect(defTexts).toContain('Component');
    expect(defTexts).toContain('test-uid-123');
    expect(defTexts).toContain('test-etag-456');
    expect(defTexts).toContain('component:default/test-component');
  });

  it('renders annotation values as links when they start with https:// or url:https://', async () => {
    await renderInTestApp(<OverviewPage entity={entity} />, { mountedRoutes });

    // url:https:// prefix is stripped from href but full value shown as link text
    // The accessible name includes ", Opens in a new window" appended by the Link component
    const sourceLocationLink = await screen.findByRole('link', {
      name: /url:https:\/\/github\.com\/example\/repo/,
    });
    expect(sourceLocationLink).toHaveAttribute(
      'href',
      'https://github.com/example/repo',
    );

    // Plain non-URL annotation value renders as text, not a link
    expect(
      screen.queryByRole('link', { name: 'dir:.' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('dir:.')).toBeInTheDocument();
  });

  it('renders tags', async () => {
    await renderInTestApp(<OverviewPage entity={entity} />, { mountedRoutes });

    expect(await screen.findByText('java')).toBeInTheDocument();
    expect(screen.getByText('data')).toBeInTheDocument();
  });
});
