import React from 'react';
import { render } from '@testing-library/react';
import LoginComponent from './LoginComponent';

describe('LoginComponent', () => {
  it('should render', () => {
    const rendered = render(<LoginComponent />);
    expect(rendered.getByText('Username')).toBeInTheDocument();
  });
});
