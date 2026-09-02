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
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EntityDialog } from './EntityDialog';
import { UnprocessedEntity } from '@backstage/plugin-catalog-unprocessed-entities-common';

const entity: UnprocessedEntity = {
  entity_id: 'id-alpha',
  entity_ref: 'component:default/alpha',
  unprocessed_entity: {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'alpha' },
    spec: { owner: 'team-a' },
  },
  next_update_at: '2026-09-03T08:15:08.088Z',
  last_discovery_at: '2026-09-03T08:15:08.088Z',
};

describe('EntityDialog', () => {
  it('opens a dialog with the raw entity definition and closes again', async () => {
    const user = userEvent.setup();
    await renderInTestApp(<EntityDialog entity={entity} />);

    // Dialog is closed initially.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'Show raw entity definition of component:default/alpha',
      }),
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      await screen.findByText('Raw entity definition'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
