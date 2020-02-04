import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { theme } from './PageThemeProvider';

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateAreas:
      "'pageHeader pageHeader pageHeader' 'pageSubheader pageSubheader pageSubheader' 'pageNav pageContent pageSidebar'",
    gridTemplateRows: 'auto auto 1fr',
    gridTemplateColumns: 'auto 1fr auto',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
  },
});

export const Theme = React.createContext({});

class Page extends Component {
  static defaultProps = {
    theme: theme.other,
  };

  render() {
    const { theme, backgroundColor, classes, children, styles = {}, ...otherProps } = this.props;

    return (
      <Theme.Provider value={theme}>
        <div style={{ backgroundColor, ...styles }} className={classes.root} {...otherProps}>
          {children}
        </div>
      </Theme.Provider>
    );
  }
}

export default withStyles(styles)(Page);
