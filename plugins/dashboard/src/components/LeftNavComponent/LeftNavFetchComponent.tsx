import React from 'react';
import { render } from '@testing-library/react';
import { LeftNavComponent } from './LeftNavComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { msw } from '@backstage/test-utils';

describe('LeftNavComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  msw.setupDefaultHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('https://randomuser.me/*', (_, res, ctx) =>
        res(ctx.status(200), ctx.delay(2000), ctx.json({})),
      ),
    );
  });
  it('should render', async () => {
    const rendered = render(<LeftNavComponent />);
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
