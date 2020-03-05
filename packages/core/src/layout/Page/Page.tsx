import React, { Component } from 'react';
import { theme } from './PageThemeProvider';

type Theme = typeof theme['service'];

export const Theme = React.createContext<Theme>(theme.service);

class Page extends Component<{ theme: Theme }> {
  static defaultProps = {
    theme: theme.home,
  };

  render() {
    const { theme, children } = this.props;

    return <Theme.Provider value={theme}>{children}</Theme.Provider>;
  }
}

export default Page;
