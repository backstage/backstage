import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './HomePage';
import { ThemeProvider } from '@material-ui/core';
import { BackstageTheme } from '@spotify-backstage/core';

describe('HomePage', () => {
  it('should render', () => {
    const rendered = render(
      <ThemeProvider theme={BackstageTheme}>
        <HomePage />
      </ThemeProvider>,
    );
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
