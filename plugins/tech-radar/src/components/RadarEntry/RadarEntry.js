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
    fontSize: '9px',
    fill: '#fff',
    textAnchor: 'middle',
  },

  link: {
    cursor: 'pointer',
  },
};

class RadarEntry extends React.PureComponent {
  render() {
    const {
      moved,
      color,
      url,
      number,
      x,
      y,
      onMouseEnter,
      onMouseLeave,
      onClick,
      classes,
    } = this.props;

    const style = { fill: color };

    let blip;
    if (moved > 0) {
      blip = <path d="M -11,5 11,5 0,-13 z" style={style} />; // triangle pointing up
    } else if (moved < 0) {
      blip = <path d="M -11,-5 11,-5 0,13 z" style={style} />; // triangle pointing down
    } else {
      blip = <circle r={9} style={style} />;
    }

    if (url) {
      blip = (
        <a href={url} className={classes.link}>
          {blip}
        </a>
      );
    }

    return (
      <g
        transform={`translate(${x}, ${y})`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {blip}
        <text y={3} className={classes.text}>
          {number}
        </text>
      </g>
    );
  }
}

RadarEntry.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  url: PropTypes.string,
  moved: PropTypes.number,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadarEntry);
