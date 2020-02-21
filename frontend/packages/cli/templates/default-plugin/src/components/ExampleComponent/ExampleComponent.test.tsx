import React from 'react';
import { render } from '@testing-library/react';
import ExampleComponent from './ExampleComponent';

describe('ExampleComponent', () => {
  it('should render', () => {
    const rendered = render(<ExampleComponent />);
    expect(rendered.getByText('Hello!')).toBeInTheDocument();
  });
});
