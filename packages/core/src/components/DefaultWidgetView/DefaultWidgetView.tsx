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
import { Grid, Paper, makeStyles, Theme } from '@material-ui/core';
import { WidgetViewProps } from '../../api/widgetView/types';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  widgetWrapper: {
    padding: theme.spacing(2),
  },
}));

const WidgetViewComponent: FC<WidgetViewProps> = ({ widgets }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container direction="row" spacing={2}>
        {widgets.map(({ size, component: WidgetComponent }, index) => (
          <Grid key={index} item xs={size}>
            <Paper className={classes.widgetWrapper}>
              <WidgetComponent />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default WidgetViewComponent;
