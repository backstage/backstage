import React from 'react';
import { render } from '@testing-library/react';
import WelcomePage from './WelcomePage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';

describe('WelcomePage', () => {
  it('should render', () => {
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <WelcomePage />
      </ThemeProvider>,
    );
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
