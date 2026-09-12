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
import { EmbeddedDocsRouter, LegacyEmbeddedDocsRouter } from './Router';

jest.mock('react-router-dom', () => ({
  useRoutes: (routes: Array<{ element: JSX.Element }>) => routes[0].element,
  Route: () => null,
  Routes: () => null,
}));

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => ({
    entity: {
      metadata: {
        name: 'example',
        annotations: { 'backstage.io/techdocs-ref': 'dir:.' },
      },
    },
  }),
  MissingAnnotationEmptyState: () => null,
}));

jest.mock('./EntityPageDocs', () => ({
  EntityPageDocs: ({ layout }: { layout: string }) => (
    <div data-testid="entity-page-docs" data-layout={layout} />
  ),
}));

describe('embedded docs routers', () => {
  it('uses the BUI layout for the alpha router', () => {
    render(<EmbeddedDocsRouter />);

    expect(screen.getByTestId('entity-page-docs')).toHaveAttribute(
      'data-layout',
      'bui',
    );
  });

  it('keeps the public compatibility router on the legacy layout', () => {
    render(<LegacyEmbeddedDocsRouter />);

    expect(screen.getByTestId('entity-page-docs')).toHaveAttribute(
      'data-layout',
      'legacy',
    );
  });
});
