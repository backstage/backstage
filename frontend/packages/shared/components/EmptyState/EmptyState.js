import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import PenguinIcon from 'cdn/sadpenguin.png';

const styles = {
  container: {
    maxWidth: 500,
    marginTop: 120,
  },
  img: {
    width: 160,
    opacity: 0.3,
    paddingBottom: 10,
  },
  bottomText: {
    fontSize: '85%',
    width: '80%',
    color: '#6F6F6F',
  },
};

/**
 * This component is a generic full page empty state screen.
 * For example on how to use it @see {@link src/core/app/AppBar/Notifications/Notifications.js}
 */
export default class EmptyState extends Component {
  static propTypes = {
    info: PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      helperText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
      button: PropTypes.element,
      bottomText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    }).isRequired,
  };

  render() {
    const { info } = this.props;
    const imgSrc = info.image || PenguinIcon;
    return (
      <div align="center" data-testid="empty">
        <div align="center" style={styles.container}>
          <img src={imgSrc} alt="empty" style={styles.img} />
          <Typography variant="h6">{info.title}</Typography>
          <p>{info.helperText}</p>
          {info.button}
          <p style={styles.bottomText}>{info.bottomText}</p>
        </div>
      </div>
    );
  }
}
