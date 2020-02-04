import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import AppHeader from './AppHeader';

describe('<AppHeader />', () => {
  it('renders without exploding', () => {
    const app = {
      id: 'app-id',
      componentType: 'app',
      componentInfoLocationUri: 'ghe:/a/b/c.yaml',
      owner: {
        name: 'app-owner',
        type: 'squad',
      },
      lifecycle: 'app-lifecycle',
    };
    const { getByText } = render(wrapInThemedTestApp(<AppHeader app={app} />));
    getByText('app-id');
    getByText('app-owner');
    getByText('app-lifecycle');
  });
});
