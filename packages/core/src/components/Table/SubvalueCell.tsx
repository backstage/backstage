import React, { FC } from 'react';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core';

const useSubvalueCellStyles = makeStyles<BackstageTheme>(theme => ({
  value: {
    marginBottom: '6px',
  },
  subvalue: {
    color: theme.palette.textSubtle,
    fontWeight: 'normal',
  },
}));

type SubvalueCellProps = {
  value: React.ReactNode;
  subvalue: React.ReactNode;
};

const SubvalueCell: FC<SubvalueCellProps> = ({ value, subvalue }) => {
  const classes = useSubvalueCellStyles();

  return (
    <>
      <div className={classes.value}>{value}</div>
      <div className={classes.subvalue}>{subvalue}</div>
    </>
  );
};

export default SubvalueCell;
