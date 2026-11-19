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
import { Entity } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import { actionFactories } from './actions';
import { DocsTableRow } from './types';

function createRow(
  entity: Partial<Entity> & { metadata: Entity['metadata'] },
): DocsTableRow {
  return {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      ...entity,
    },
    resolved: {
      docsUrl: '/docs/default/component/my-service',
      ownedByRelationsTitle: '',
      ownedByRelations: [],
    },
  };
}

describe('actionFactories', () => {
  it('gives the copy-link action a unique accessible name and tooltip', () => {
    const row = createRow({ metadata: { name: 'my-service' } });
    const action = actionFactories.createCopyDocsUrlAction(jest.fn())(row);

    expect(action.tooltip).toBe('Copy link to my-service documentation');

    render(<>{action.icon()}</>);
    expect(
      screen.getByText('Copy link to my-service documentation'),
    ).toBeInTheDocument();
  });

  it('prefers metadata.title when naming the copy-link action', () => {
    const row = createRow({
      metadata: { name: 'my-service', title: 'My Service Docs' },
    });
    const action = actionFactories.createCopyDocsUrlAction(jest.fn())(row);

    expect(action.tooltip).toBe('Copy link to My Service Docs documentation');
  });

  it('gives the favorite action unique add and remove names', async () => {
    const row = createRow({ metadata: { name: 'my-service' } });

    const addAction = actionFactories.createStarEntityAction(
      () => false,
      jest.fn(),
    )(row);
    expect(addAction.tooltip).toBe('Add my-service to favorites');
    await renderInTestApp(<>{addAction.icon()}</>);
    expect(screen.getByText('Add my-service to favorites')).toBeInTheDocument();

    const removeAction = actionFactories.createStarEntityAction(
      () => true,
      jest.fn(),
    )(row);
    expect(removeAction.tooltip).toBe('Remove my-service from favorites');
    await renderInTestApp(<>{removeAction.icon()}</>);
    expect(
      screen.getByText('Remove my-service from favorites'),
    ).toBeInTheDocument();
  });

  it('uses the translation function when provided', () => {
    const row = createRow({ metadata: { name: 'my-service' } });
    const t = jest.fn(
      (key: string, params?: { entityName?: string }) =>
        `translated:${key}:${params?.entityName}`,
    );

    const action = actionFactories.createCopyDocsUrlAction(
      jest.fn(),
      t as any,
    )(row);

    expect(t).toHaveBeenCalledWith('table.actions.copyDocsUrl', {
      entityName: 'my-service',
    });
    expect(action.tooltip).toBe(
      'translated:table.actions.copyDocsUrl:my-service',
    );
  });
});
