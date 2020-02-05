import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders learn react link', () => {
    const rendered = render(<App />);
    rendered.getByText('This is Backstage!');
  });
});
