/*
 * Copyright 2026 The Backstage Authors
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

import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { getTimes, type ClockConfig } from './clocks';

const useStyles = makeStyles(theme => ({
  label: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.fontSize * 1.5,
    marginBottom: theme.spacing(0.5),
    lineHeight: 1,
  },
  value: {
    fontSize: theme.typography.fontSize * 1.5,
    lineHeight: 1,
    color: theme.palette.text.secondary,
  },
}));

export const WorldClock = (props: {
  clockConfigs?: ClockConfig[];
  customTimeFormat?: Intl.DateTimeFormatOptions;
}) => {
  const { clockConfigs, customTimeFormat } = props;
  const classes = useStyles();
  const [clocks, setClocks] = useState(
    getTimes(clockConfigs ?? [], customTimeFormat),
  );

  useEffect(() => {
    if (!clockConfigs?.length) {
      return undefined;
    }
    setClocks(getTimes(clockConfigs, customTimeFormat));
    const id = setInterval(() => {
      setClocks(getTimes(clockConfigs, customTimeFormat));
    }, 1000);
    return () => clearInterval(id);
  }, [clockConfigs, customTimeFormat]);

  if (!clockConfigs?.length) {
    return (
      <Typography color="textSecondary">
        No clocks configured. Add clock configurations in your app-config.yaml
        to display world clocks.
      </Typography>
    );
  }

  return (
    <Grid container spacing={4}>
      {clocks.map(clock => (
        <Grid
          item
          key={clock.label}
          aria-label={`${clock.label}: ${clock.value}`}
        >
          <Typography className={classes.label}>{clock.label}</Typography>
          <Typography className={classes.value}>
            <time dateTime={clock.dateTime}>{clock.value}</time>
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
