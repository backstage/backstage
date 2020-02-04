import React, { FC } from 'react';
import { Divider, IconButton, InputBase, Paper } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { RemoveIcon } from 'shared/icons';

type Props = {
  filterTerm: string;
  onFilterChanged: (filter: string) => any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      marginBottom: theme.spacing(4),
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

const FilterSettings: FC<Props> = ({ filterTerm, onFilterChanged }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <IconButton disabled className={classes.iconButton} aria-label="filter">
        <FindInPageIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Filter"
        inputProps={{ 'aria-label': 'filter the list' }}
        value={filterTerm}
        onChange={event => onFilterChanged(event.target.value)}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        className={classes.iconButton}
        aria-label="clear"
        onClick={() => onFilterChanged('')}
        onMouseDown={() => onFilterChanged('')}
      >
        <RemoveIcon />
      </IconButton>
    </Paper>
  );
};

export default FilterSettings;
