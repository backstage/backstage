import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import AppNavigation from './AppNavigation';

describe('<AppNavigation />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(wrapInThemedTestApp(<AppNavigation id="id" system="system" />));
    getByText('Overview');
  });
});
