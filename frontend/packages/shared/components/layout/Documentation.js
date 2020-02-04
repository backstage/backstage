import React, { Component, Fragment } from 'react';
import { ListItemIcon, Typography } from '@material-ui/core';
import { TechDocsIcon } from 'shared/icons';

/**
 * Documentation component to be used inside a SupportButton block.
 */
class Documentation extends Component {
  render() {
    const { children } = this.props;
    return (
      <Fragment>
        <ListItemIcon>
          <TechDocsIcon />
        </ListItemIcon>
        <div>
          <Typography variant="subtitle1">Documentation</Typography>
          {React.Children.map(children, (child, index) => (
            <Typography key={index}>{child}</Typography>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default Documentation;
