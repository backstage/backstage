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

class Lifecycle extends Component {
  static propTypes = {
    isShorthand: PropTypes.bool,
    fontSize: PropTypes.string,
  };
}

const styles = {
  alpha: {
    color: '#d00150',
    fontFamily: 'serif',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  beta: {
    color: '#4d65cc',
    fontFamily: 'serif',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
};

export class AlphaLabel extends Lifecycle {
  render() {
    const style = fontSize => ({ ...styles.alpha, fontSize, ...this.props.style });
    return this.props.isShorthand ? (
      <span style={style('120%')}>&alpha;</span>
    ) : (
      <span style={style('100%')}>Alpha</span>
    );
  }
}

export class BetaLabel extends Lifecycle {
  render() {
    const fontSize = this.props.fontSize || (this.props.isShorthand ? '120%' : '100%');
    const style = { ...styles.beta, fontSize, ...this.props.style };

    return this.props.isShorthand ? <span style={style}>&beta;</span> : <span style={style}>Beta</span>;
  }
}
