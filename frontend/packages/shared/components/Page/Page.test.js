import React from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp } from 'testUtils';

import Page from './Page';

describe('<Page />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInTestApp(<Page />));
    expect(rendered).toBeDefined();
  });
});
