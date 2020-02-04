import { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class DateCell extends Component {
  static propTypes = {
    value: PropTypes.string,
    column: PropTypes.shape({
      format: PropTypes.string,
    }),
  };

  render() {
    const { value, column } = this.props;
    const { format, utc } = column;

    if (!value) {
      return null;
    }

    const date = utc ? moment.utc(value) : moment(value);

    if (format) {
      return date.format(format);
    }
    return date.toString();
  }

  static sort(a, b) {
    return moment(a).isBefore(moment(b)) ? -1 : 1;
  }
}
