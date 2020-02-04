import React, { Component, Fragment } from 'react';
import { ListItemIcon, Typography } from '@material-ui/core';

import SOEIcon from 'shared/assets/icons/soe.png';

/**
 * StackOverflow component to be used inside a SupportButton block.
 */
class StackOverflow extends Component {
  render() {
    const { children } = this.props;
    return (
      <Fragment>
        <ListItemIcon>
          <img src={SOEIcon} alt="SOE" width="24" height="24" />
        </ListItemIcon>
        <div>
          <Typography variant="subtitle1">StackOverflow Tags</Typography>
          {React.Children.map(children, (child, index) => (
            <span key={index}>{child}</span>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default StackOverflow;
