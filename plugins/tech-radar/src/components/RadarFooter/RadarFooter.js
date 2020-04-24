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

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

const styles = {
  text: {
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: '10px',
    fill: '#000',
  },
};

class RadarFooter extends React.PureComponent {
  render() {
    const { x, y, classes } = this.props;

    return (
      <text
        transform={`translate(${x}, ${y})`}
        space="preserve"
        className={classes.text}
      >
        {'▲ moved up\u00a0\u00a0\u00a0\u00a0\u00a0▼ moved down'}
      </text>
    );
  }
}

RadarFooter.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadarFooter);
