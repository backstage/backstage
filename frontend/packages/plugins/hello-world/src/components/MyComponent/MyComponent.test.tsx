import React from 'react';
import { render } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    const rendered = render(<MyComponent />);
    expect(rendered.getByText('Hello!')).toBeInTheDocument();
  });
});
