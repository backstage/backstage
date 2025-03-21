import React from 'react';
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  it('should render', async () => {
    await renderInTestApp(<ExampleComponent />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should display a custom message', async () => {
    await renderInTestApp(<ExampleComponent message="Hello Example" />);

    expect(screen.getByText('Hello Example')).toBeInTheDocument();
  });
});
