import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, withStyles } from '@material-ui/core';

import { StatusError } from 'shared/components/Status';
import Link from 'shared/components/Link';
import HeaderLabel from 'shared/components/layout/HeaderLabel';

const style = theme => ({
  notVerified: {
    color: theme.palette.status.error,
    borderRadius: 4,
    padding: '3px 6px',
    fontSize: '8pt',
    opacity: 0.8,
    fontWeight: 'bold',
    position: 'relative',
    top: -4,
    backgroundColor: 'pink',
    float: 'right',
    marginLeft: 14,
  },
  label: { float: 'left' },
});

class OwnerHeaderLabel extends Component {
  static propTypes = {
    owner: PropTypes.object.isRequired,
  };

  render() {
    const { owner, classes } = this.props;
    const isBadSquad = owner.type !== 'squad';

    const notVerified = isBadSquad && (
      <Link to="https://spotify.stackenterprise.co/a/4412/23">
        <span className={classes.notVerified}>
          <StatusError style={{ position: 'relative', top: 2 }} /> Squad not verified!
        </span>
      </Link>
    );
    const label = (
      <Tooltip
        title="This component is not owned by an existing squad. Click the badge to learn how to fix this."
        placement="bottom"
      >
        <span>
          <span className={classes.label}>{owner.name}</span>
        </span>
      </Tooltip>
    );
    return (
      <>
        <HeaderLabel
          label="Owner"
          value={isBadSquad ? label : owner.name}
          url={owner.name ? `/org/${owner.name}` : ''}
        />
        {notVerified}
      </>
    );
  }
}

export default withStyles(style)(OwnerHeaderLabel);
