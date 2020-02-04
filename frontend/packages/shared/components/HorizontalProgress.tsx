import React, { FC } from 'react';
import { Tooltip } from '@material-ui/core';
// @ts-ignore
import { Line } from 'rc-progress';
import CircleProgress from 'shared/components/CircleProgress';

type Props = {
  value: number;
};

const HorizontalProgress: FC<Props> = ({ value }) => {
  if (isNaN(value)) {
    return null;
  }
  let percent = Math.round(value * 100 * 100) / 100;
  if (percent > 100) {
    percent = 100;
  }
  const strokeColor = CircleProgress.getProgressColor(percent, false, 100);
  return (
    <Tooltip title={`${percent}%`}>
      <Line percent={percent} strokeWidth={4} trailWidth={4} strokeColor={strokeColor} />
    </Tooltip>
  );
};

export default HorizontalProgress;
