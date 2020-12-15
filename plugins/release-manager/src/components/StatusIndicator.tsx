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
import React, { FC } from 'react';
import { styled, makeStyles } from '@material-ui/core';
import { Status } from '../types';
import { lightTheme } from '@backstage/theme';
import { RmTooltip } from './RmTooltip';

export const StatusIndicator: FC<{ status: Status; tooltip?: string }> = ({
  status,
  tooltip,
}) => {
  if (status === 'loading') {
    return (
      <RmTooltip title={tooltip || 'Loading...'}>
        <StatusBoxLoading />
      </RmTooltip>
    );
  }

  if (status === 'ok') {
    return (
      <RmTooltip title={tooltip || 'OK'}>
        <StatusBox color={lightTheme.palette.status.ok} />
      </RmTooltip>
    );
  }

  if (status === 'warning') {
    return (
      <RmTooltip title={tooltip || 'Warning'}>
        <StatusBox color="#F7D000" />
      </RmTooltip>
    );
  }

  if (status === 'error') {
    return (
      <RmTooltip title={tooltip || 'Error'}>
        <StatusBox color={lightTheme.palette.status.error} />
      </RmTooltip>
    );
  }

  if (status === 'no-data') {
    return (
      <RmTooltip title={tooltip || 'No data'}>
        <StatusBox color="#CCCCCC" />
      </RmTooltip>
    );
  }

  return <StatusBox color="#CCCCCC" />;
};

const useStyles = makeStyles({
  '@keyframes loading': {
    from: { background: 'white' },
    to: { background: '#CCCCCC' },
  },
  statusBoxLoading: {
    animation: '0.5s ease infinite alternate $loading',
    borderRadius: '50%',
    minWidth: 16,
    width: 16,
    height: 16,
    marginRight: 12,
    top: 3,
    position: 'relative',
    display: 'inline-block',
  },
});

const StatusBoxLoading = React.forwardRef<any>((props, ref) => {
  const classes = useStyles();

  return <span ref={ref} {...props} className={classes.statusBoxLoading} />;
});

const StatusBox = styled(
  React.forwardRef<any>((props, ref) => {
    return <span ref={ref} {...props} />;
  }),
)({
  borderRadius: '50%',
  background: (props: any) => props.color,
  minWidth: 16,
  width: 16,
  height: 16,
  marginRight: 12,
  top: 3,
  position: 'relative',
  display: 'inline-block',
});
