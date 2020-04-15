/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Link, withStyles } from '@material-ui/core';

import { StatusError } from 'components/Status';
import HeaderLabel from './HeaderLabel';

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
      <Link href="https://spotify.stackenterprise.co/a/4412/23">
        <span className={classes.notVerified}>
          <StatusError style={{ position: 'relative', top: 2 }} /> Squad not
          verified!
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
