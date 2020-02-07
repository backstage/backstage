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
