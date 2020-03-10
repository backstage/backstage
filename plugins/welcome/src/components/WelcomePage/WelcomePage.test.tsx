import React from 'react';
import { render } from '@testing-library/react';
import WelcomePage from './WelcomePage';
import { ThemeProvider } from '@material-ui/core';
import { BackstageTheme } from '@spotify-backstage/core';

describe('WelcomePage', () => {
  it('should render', () => {
    const rendered = render(
      <ThemeProvider theme={BackstageTheme}>
        <WelcomePage />
      </ThemeProvider>,
    );
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
