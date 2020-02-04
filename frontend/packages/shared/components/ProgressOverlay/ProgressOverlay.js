import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    position: 'relative',
  },
  wrapper: {
    top: 0,
    left: 0,
    zIndex: theme.zIndex.modal,
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: theme.palette.background.paper,
    opacity: 0.6,
  },
  progress: {
    margin: 'auto',
  },
});

class ProgressOverlay extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired, // withStyles
  };

  render() {
    const { show, classes, children } = this.props;

    return (
      <div className={classes.root}>
        {show && (
          <div className={classes.wrapper}>
            <div className={classes.overlay} />
            <CircularProgress size={24} className={classes.progress} data-testid="progress" />
          </div>
        )}
        <div>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(ProgressOverlay);
