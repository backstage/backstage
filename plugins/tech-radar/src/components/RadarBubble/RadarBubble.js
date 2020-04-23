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
import styles from './RadarBubble.css';

export default class RadarBubble extends React.PureComponent {
  componentDidMount() {
    this._updatePosition();
  }

  componentDidUpdate() {
    this._updatePosition();
  }

  _setRect = rect => {
    this.rect = rect;
  };
  _setNode = node => {
    this.node = node;
  };
  _setText = text => {
    this.text = text;
  };
  _setPath = path => {
    this.path = path;
  };

  _updatePosition() {
    // We can't do this in render() because we need to measure how big the text is to draw the bubble around it
    // this.text will not be set during testing because there is no real DOM
    if (this.text) {
      const { x, y } = this.props;
      const bbox = this.text.getBBox();
      const marginX = 5;
      const marginY = 4;
      this.node.setAttribute(
        'transform',
        `translate(${x - bbox.width / 2}, ${y - bbox.height - marginY})`,
      );
      this.rect.setAttribute('x', -marginX);
      this.rect.setAttribute('y', -bbox.height);
      this.rect.setAttribute('width', bbox.width + 2 * marginX);
      this.rect.setAttribute('height', bbox.height + marginY);
      this.path.setAttribute(
        'transform',
        `translate(${bbox.width / 2 - marginX}, ${marginY - 1})`,
      );
    }
  }

  render() {
    const { visible, text } = this.props;
    return (
      <g
        ref={this._setNode}
        x={0}
        y={0}
        className={visible ? styles.visibleBubble : styles.bubble}
      >
        <rect ref={this._setRect} rx={4} ry={4} className={styles.background} />
        <text ref={this._setText} className={styles.text}>
          {text}
        </text>
        <path
          ref={this._setPath}
          d="M 0,0 10,0 5,8 z"
          className={styles.background}
        />
      </g>
    );
  }
}

RadarBubble.propTypes = {
  visible: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};
