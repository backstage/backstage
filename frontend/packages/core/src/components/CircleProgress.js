import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Circle } from 'rc-progress';
import { COLORS } from '../theme/BackstageTheme';

const styles = theme => ({
  root: {
    position: 'relative',
    lineHeight: 0,
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -60%)',
    fontSize: 45,
    fontWeight: 'bold',
    color: theme.palette.textSubtle,
  },
  circle: {
    width: '80%',
    transform: 'translate(10%, 0)',
  },
});

class CircleProgress extends Component {
  static propTypes = {
    value: PropTypes.any.isRequired,
    fractional: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    inverse: PropTypes.bool,
    unit: PropTypes.string,
    max: PropTypes.number,
  };

  static defaultProps = {
    fractional: true,
    inverse: false,
    unit: '%',
    max: 100,
  };

  static getProgressColor(value, inverse, max /* , classes */) {
    if (isNaN(value)) {
      return 'grey';
    }

    max = max ? max : CircleProgress.defaultProps.max;
    value = inverse ? max - value : value;

    if (value < max / 3) {
      return COLORS.STATUS.ERROR;
    } else if (value < max * (2 / 3)) {
      return COLORS.STATUS.WARNING;
    }
    return COLORS.STATUS.OK;
  }

  render() {
    const { value, fractional, classes, inverse, unit, max } = this.props;

    const asPercentage = fractional ? Math.round(value * max) : value;
    const asActual = max !== 100 ? Math.round(value) : asPercentage;

    return (
      <div className={classes.root}>
        <Circle
          strokeLinecap="butt"
          percent={asPercentage}
          strokeWidth="12"
          trailWidth="12"
          strokeColor={CircleProgress.getProgressColor(
            asActual,
            inverse,
            max,
            classes,
          )}
          className={classes.circle}
        />
        <div className={classes.overlay}>
          {isNaN(value) ? 'N/A' : `${asActual}${unit}`}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CircleProgress);
