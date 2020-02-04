import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';
import ManageNavigation from './ManageNavigation';

describe('<ManageNavigation />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<ManageNavigation />));
    rendered.getByText('Overview');
    expect(rendered.queryByText('Streaming Pipelines')).not.toBeInTheDocument();
  });

  it('renders bigquery link', () => {
    const mock = jest.spyOn(FeatureFlags, 'getItem').mockImplementation(flag => flag === 'galileo');
    const rendered = render(wrapInThemedTestApp(<ManageNavigation />));
    rendered.getByText('Streaming Pipelines');
    mock.mockRestore();
  });
});
