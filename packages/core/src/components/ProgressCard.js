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
import { withStyles } from '@material-ui/core';

import InfoCard from '../layout/InfoCard';
import CircleProgress from './CircleProgress';

const styles = {
  root: {
    height: '100%',
    width: 250,
  },
};

class ProgressCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    subheader: PropTypes.string,
    progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    deepLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      }),
    ]),
    gacontext: PropTypes.string,
  };

  render() {
    const {
      title,
      subheader,
      progress,
      deepLink,
      classes,
      variant,
    } = this.props;
    const link =
      deepLink &&
      (typeof deepLink === 'string'
        ? { title: 'View more', link: deepLink }
        : deepLink);
    return (
      <div className={classes.root}>
        <InfoCard
          title={title}
          subheader={subheader}
          deepLink={link}
          variant={variant}
        >
          <CircleProgress value={progress} />
        </InfoCard>
      </div>
    );
  }
}

export default withStyles(styles)(ProgressCard);
