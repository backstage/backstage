import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen} from '@testing-library/react';
import {
    setupRequestMockHandlers,
    renderInTestApp,
    TestApiRegistry,
} from '@backstage/test-utils';
import { gerritUsersBuffer, gerritChangesBuffer} from '../__fixtures__';
import { Entity } from '@backstage/catalog-model'
import { GerritReviews } from './RepoGerritReviews'
import { discoveryApiRef, configApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/config';
import { ApiProvider } from '@backstage/core-app-api';
import { EntityProvider, CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';

jest.mock('react-text-truncate', () => {
  const { forwardRef } = jest.requireActual('react');
  return {
      __esModule: true,
      default: forwardRef((props: any, ref: any) => (
          <div ref={ref}>{props.text}</div>
      )),
  };
});
const catalogApi: jest.Mocked<CatalogApi> = {
  getEntities: jest.fn(),
} as any;

describe('gerrit reviews', () => {
    let apis: any;
    const gerritRepo= 'cloud-ran/my-cloud-ran-gerrit-repo'
    const mockBaseUrl = 'http://localhost:7007/proxy';
    const gerritBaseUrl = 'gerrit-review.gic.ericsson.se';

    const server = setupServer(
      rest.get(`${mockBaseUrl}/gerrit/a/accounts/*`, (_, res, ctx) =>
          res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.body(gerritUsersBuffer),
          ),
      ),
      rest.get(`${mockBaseUrl}/gerrit/a/changes/*`, (_, res, ctx) =>
          res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.body(gerritChangesBuffer)
          ),
      ),
    );

    // Enable handlers for network requests
    setupRequestMockHandlers(server);

    const mockEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: "repo1",
        annotations: {
          'gerrit/component': `${gerritRepo}`,
        },
        spec: {
          type: 'service',
          owner: 'guest',
        }
      }
    } as Entity

    beforeEach(() => {
      const provider = {
          host: 'gerrit-review.gic.ericsson.se',
          query: 'state=ACTIVE',
      };
      const config = {
          catalog: {
              providers: {
                  gerrit: {
                      'active-g1': provider,
                  },
              },
          },
          integrations: {
              gerrit: [{
                  host: gerritBaseUrl,
                  baseUrl: `https://${gerritBaseUrl}`,
                  cloneUrl: `https://${gerritBaseUrl}/admin/repos`,
                  gitilesBaseUrl: `https://${gerritBaseUrl}/plugins/gitiles`,
              }]
          },
      };
      const mockDiscoveryApi = {
          getBaseUrl: () => mockBaseUrl,
      } as unknown as Partial<DiscoveryApi>;

      apis = TestApiRegistry.from(
          [discoveryApiRef, mockDiscoveryApi],
          [configApiRef, new ConfigReader(config)],
          [catalogApiRef, catalogApi]
      );
    });
    afterEach(() => {
      server.resetHandlers();
    })
    it('should render GerritReviews', async () => {
      await renderInTestApp(
          <ApiProvider apis={apis}>
            <EntityProvider entity = {mockEntity}>
              <GerritReviews/>
            </EntityProvider>
          </ApiProvider>,
      );
      expect(screen.queryByText(`${gerritRepo}`)).toBeInTheDocument();
    });

    it('should not render GerritReviews:Due to HTTP errors', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/gerrit/a/changes/`, (_req, res, ctx) => {
          return res(ctx.status(500))
        }),
      )
      await renderInTestApp(
          <ApiProvider apis={apis}>
            <EntityProvider entity = {mockEntity}>
              <GerritReviews />
            </EntityProvider>
          </ApiProvider>,
      );
      expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
    });
});
