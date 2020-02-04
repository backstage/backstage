import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import DataEndpointContentHeader from './DataEndpointContentHeader';

describe('<DataEndpointContentHeader />', () => {
  it('renders without exploding', () => {
    const data = {
      id: 'my-id',
      componentType: 'data-endpoint',
      componentInfoLocationUri: 'ghe:/a/b/c.yaml',
      owner: {
        name: 'my-owner',
        type: 'squad',
      },
      lifecycle: 'my-lifecycle',
    };
    const rendered = render(wrapInThemedTestApp(<DataEndpointContentHeader DataEndpoint={data} />));
    rendered.getByText('Data Endpoints');
    rendered.getByText('Create new data endpoints component');
    rendered.getByText('Support');
  });
});
