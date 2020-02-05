import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('should render', () => {
    const rendered = render(<HomePage />);
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
