import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render', () => {
    const rendered = render(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
