import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import App from './App';

describe('App', () => {
  it('should render', async () => {
    Object.defineProperty(process.env, 'APP_CONFIG', {
      configurable: true,
      value: [
        {
          data: {
            app: { title: 'Test' },
          },
          context: 'test',
        },
      ],
    });

    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
