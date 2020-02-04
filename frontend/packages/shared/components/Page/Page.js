import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height: '100%',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    ...theme.mixins.gutters({}),
  },
});

/**
 * @deprecated Replaced by shared/components/layout/Page; see https://backstage.spotify.net/docs/backstage-layout-components
 */
class Page extends Component {
  render() {
    const { children, style } = this.props;
    return (
      <div className={this.props.classes.root} style={style}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Page);
