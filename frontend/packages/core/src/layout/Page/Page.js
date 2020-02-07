import React, { Component } from 'react';
import { theme } from './PageThemeProvider';

export const Theme = React.createContext({});

class Page extends Component {
  static defaultProps = {
    theme: theme.other,
  };

  render() {
    const { theme, children } = this.props;

    return <Theme.Provider value={theme}>{children}</Theme.Provider>;
  }
}

export default Page;
