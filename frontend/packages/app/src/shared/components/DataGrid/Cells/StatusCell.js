import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import { StatusOK, StatusError, StatusWarning, StatusPending, StatusRunning } from 'shared/components/Status';

export default class StatusCell extends Component {
  static statusIcons = {
    ok: <StatusOK />,
    running: <StatusRunning />,
    pending: <StatusPending />,
    warning: <StatusWarning />,
    error: <StatusError />,
  };

  static statuses = ['ok', 'running', 'pending', 'warning', 'error'];

  static propTypes = {
    value: PropTypes.shape({
      icon: PropTypes.oneOf(StatusCell.statuses).isRequired,
      message: PropTypes.string,
    }),
  };

  render() {
    if (!this.props.value) {
      return <span>N/A</span>;
    }

    const { icon, message } = this.props.value;

    return (
      <Tooltip title={message || icon.toUpperCase()} placement="top">
        <span style={{ whiteSpace: 'nowrap', align: 'center' }}>{StatusCell.statusIcons[icon.toLowerCase()]}</span>
      </Tooltip>
    );
  }

  static sort = (a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    const aIndex = StatusCell.statuses.indexOf(a.icon);
    const bIndex = StatusCell.statuses.indexOf(b.icon);
    if (aIndex === bIndex) return 0;
    return aIndex > bIndex ? -1 : 1;
  };
}
