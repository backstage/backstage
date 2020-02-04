import { Component } from 'react';
import PropTypes from 'prop-types';

export default class NumberCell extends Component {
  static propTypes = {
    value: PropTypes.number,
    column: PropTypes.shape({
      roundTo: PropTypes.number,
      percentOf: PropTypes.number,
    }),
  };

  render() {
    const { value, column } = this.props;
    const { roundTo = null, percentOf } = column;

    if (percentOf) {
      let percentage = (value / percentOf) * 100;
      if (roundTo !== null || percentage % 1 !== 0) {
        percentage = percentage.toFixed(roundTo === null ? 2 : roundTo);
      }
      return `${percentage}%`;
    }

    if (roundTo !== null || value % 1 !== 0) {
      return value.toFixed(roundTo === null ? 2 : roundTo);
    }

    return value;
  }
}
