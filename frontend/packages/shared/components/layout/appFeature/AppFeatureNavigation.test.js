import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import AppFeatureNavigation from './AppFeatureNavigation';

describe('<AppFeatureNavigation />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(wrapInThemedTestApp(<AppFeatureNavigation id="id" system="system" />));
    getByText('Overview');
  });
});
