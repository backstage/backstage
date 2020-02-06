import React from 'react';
import { render } from '@testing-library/react';
import LoginComponent from './LoginComponent';

describe('LoginComponent', () => {
  it('should render', () => {
    const onLogin = jest.fn();
    const rendered = render(<LoginComponent onLogin={onLogin} />);
    expect(rendered.getByText('Login')).toBeInTheDocument();
  });
});
