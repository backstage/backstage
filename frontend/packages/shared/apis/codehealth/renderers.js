import React from 'react';
import { pluralize, UNKNOWN_DISPLAY_VALUE } from 'shared/apis/codehealth/utils';
import Link from 'shared/components/Link';
import TestStatus from 'plugins/health/components/TestStatus';
import { Tooltip } from '@material-ui/core';

const TOOLTIP_DETAILS = 'Click to view latest invocations';

export const flakyRateRenderer = ({ value }) => `${(100.0 * value).toFixed(2)}%`;

export const passRateRenderer = ({ row, value }) => {
  if (value === Number.MAX_SAFE_INTEGER) {
    return 'No runs';
  }
  const {
    aggregateCount: { failed, successful },
  } = row;
  const cellContent = `${value.toFixed(2)}%`;
  const successfulString = 'successful';
  const totalRuns = successful + failed;
  const runString = pluralize(totalRuns, 'run');
  const tooltipContent = `${successful} ${successfulString} / ${successful + failed} ${runString} - ${TOOLTIP_DETAILS}`;
  return (
    <Tooltip title={tooltipContent}>
      <span>{cellContent}</span>
    </Tooltip>
  );
};

export const ownerCellRenderer = ({ row }) =>
  row.owner && row.owner !== 'UNKNOWN' ? (
    <Link to={`/org/${encodeURIComponent(row.owner)}`}>{row.owner}</Link>
  ) : (
    UNKNOWN_DISPLAY_VALUE
  );

export const statusRenderer = ({ row }) => <TestStatus status={row.status} />;
