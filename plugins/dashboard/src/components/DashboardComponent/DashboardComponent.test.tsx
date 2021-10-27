import React from 'react';
import { DashboardComponent } from './DashboardComponent';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { msw, renderInTestApp } from '@backstage/test-utils';

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
    const rendered = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <DashboardComponent />
      </ThemeProvider>,
    );
    expect(rendered.getByText('Welcome to dashboard!')).toBeInTheDocument();
  });
});
