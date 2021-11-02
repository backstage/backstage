import React from 'react';
import { DashboardComponent } from './DashboardComponent';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import { msw, renderInTestApp } from '@backstage/test-utils';
import { DashboardApi, DashboardRestApi, dashboardApiRef } from '../../api/api';

describe('ExampleComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  msw.setupDefaultHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    const dashboardApi: jest.Mocked<DashboardApi> = {
      getDashboardData: () => Promise.resolve({}),
    } as any;
    const apis = ApiRegistry.with(
      dashboardApiRef,
      DashboardRestApi.fromConfig(
        new ConfigReader({
          backend: {
            baseUrl: 'testUrl'
          },
          integrations: {}
        }),
      ),
    ).with(dashboardApiRef, dashboardApi);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ThemeProvider theme={lightTheme}>
          <DashboardComponent />
        </ThemeProvider>
      </ApiProvider>,
    );
    expect(rendered.getByText('DevOps Dashboard')).toBeInTheDocument();
  });
});
