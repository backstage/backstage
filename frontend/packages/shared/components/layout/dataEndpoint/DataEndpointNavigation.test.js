import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import DataEndpointNavigation from './DataEndpointNavigation';

describe('<DataEndpointNavigation />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<DataEndpointNavigation id="id" system="system" uri="gs://b/o" />));
    rendered.getByText('Overview');
    expect(rendered.queryByText('BigQuery Stats')).not.toBeInTheDocument();
  });

  it('renders bigquery link', () => {
    const rendered = render(wrapInThemedTestApp(<DataEndpointNavigation id="id" system="system" uri="bq://a/b/c" />));
    rendered.getByText('BigQuery Stats');
  });
});
