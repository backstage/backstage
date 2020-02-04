import React from 'react';
import { Tooltip } from '@material-ui/core';
import countBy from 'lodash/countBy';
import { StatusError, StatusOK, StatusWarning } from 'shared/components/Status';
import Link from 'shared/components/Link';

const PagerDutyServiceStatus = ({ service }) => {
  if (!service || !service.activeIncidents) {
    return null;
  }

  const incidents = service.activeIncidents;

  let StatusMarker;
  let title = `PagerDuty service "${service.name}": `;
  if (!incidents.length) {
    StatusMarker = StatusOK;
    title += 'OK';
  } else {
    StatusMarker = incidents.some(i => i.status === 'triggered') ? StatusError : StatusWarning;

    const statusCounts = countBy(incidents, 'status');
    title += Object.entries(statusCounts)
      .map(([status, count]) => `${count} ${status}`)
      .join(', ');
    title += ' incidents';
  }

  return (
    <Tooltip title={title}>
      <Link to={service.homepageUrl}>
        <StatusMarker />
      </Link>
    </Tooltip>
  );
};

export default PagerDutyServiceStatus;
