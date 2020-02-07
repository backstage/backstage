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
    <Grid className={classes.root} container direction="row" spacing={6}>
      {widgets.map(({ size, component: WidgetComponent }, index) => (
        <Grid key={index} item xs={size}>
          <Paper className={classes.widgetWrapper}>
            <WidgetComponent />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default WidgetViewComponent;
