import React from 'react';
import { FianuComponent } from './FianuComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";
import { EntityProvider } from '@backstage/plugin-catalog-react';

describe('FianuComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    const rendered = await renderInTestApp(
      <EntityProvider
        entity={{
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'test' },
        }}
      >
        <FianuComponent />
      </EntityProvider>,
    );
    expect(rendered.getByText('Missing Annotation')).toBeInTheDocument();
  });
});
