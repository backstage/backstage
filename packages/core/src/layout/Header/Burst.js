import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  burst: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    'z-index': -1,
  },
  /* base style of burst shape SVGs */
  burstShape: {
    position: 'absolute',
    right: 0,
    height: '100%',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    opacity: 0.1,
  },
}));

const Burst = ({ theme }) => {
  const classes = useStyles();

  return (
    <div className={classes.burst} style={{ backgroundImage: theme.gradient }}>
      <div className={classes.burstShape} style={theme.burstShape} />
    </div>
  );
};

export default Burst;
