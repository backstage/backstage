import React, { MutableRefObject } from 'react';

import { MTableToolbar } from '@material-table/core';
import {
  Grid,
  makeStyles,
  MenuItem,
  Select,
  withStyles,
} from '@material-ui/core';
import FormGroup from '@mui/material/FormGroup';

const StyledMTableToolbar = withStyles(
  _theme => ({
    root: {
      alignItems: 'center',
    },
  }),
  { name: 'BackstageTableToolbar' },
)(MTableToolbar);

const useFilterStyles = makeStyles(
  _theme => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
    },
    filter: {
      fontSize: 18,
      whiteSpace: 'nowrap',
    },
    tool: {
      marginLeft: '1rem',
    },
  }),
  { name: 'BackstageTableFiltersContainer' },
);

export const CreatedAfterOptions: {
  [key: string]: { label: string; getDate: () => Date };
} = {
  last24h: {
    label: 'Last 24h',
    getDate: () => new Date(Date.now() - 24 * 3600 * 1000),
  },
  lastWeek: {
    label: 'Last week',
    getDate: () => new Date(Date.now() - 7 * 24 * 3600 * 1000),
  },
  all: {
    label: 'Any time',
    getDate: () => new Date(0),
  },
};

export const NotificationsToolbar = (toolbarProps: {
  toolbarRef: MutableRefObject<any>;
  onSearchChanged: (value: string) => void;
  createdAfter?: string;
  unreadOnly: boolean;
  onCreatedAfterChanged: (value: string) => void;
  onUnreadOnlyChanged: (checked?: boolean) => void;
}) => {
  const { toolbarRef, createdAfter, unreadOnly } = toolbarProps;
  const filtersClasses = useFilterStyles();

  const handleOnCreatedAfterChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    toolbarProps.onCreatedAfterChanged(event.target.value as string);
  };

  const handleOnUnreadOnlyChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    let value = undefined;
    if (event.target.value === 'unread') value = true;
    if (event.target.value === 'read') value = false;
    toolbarProps.onUnreadOnlyChanged(value);
  };

  let unreadOnlyValue = 'all';
  if (unreadOnly) unreadOnlyValue = 'unread';
  if (unreadOnly === false) unreadOnlyValue = 'read';

  return (
    <Grid spacing={2} container className={filtersClasses.root}>
      <Grid item className={filtersClasses.tool}>
        <Select
          label="Created after"
          className={filtersClasses.filter}
          placeholder="Notifications since"
          value={createdAfter}
          onChange={handleOnCreatedAfterChanged}
        >
          {Object.keys(CreatedAfterOptions).map((key: string) => (
            <MenuItem value={key} key={key}>
              {CreatedAfterOptions[key].label}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item className={filtersClasses.tool}>
        <FormGroup>
          <Select
            label="Show"
            className={filtersClasses.filter}
            value={unreadOnlyValue}
            onChange={handleOnUnreadOnlyChanged}
          >
            <MenuItem value="unread">Unread only</MenuItem>
            <MenuItem value="read">Marked as read</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormGroup>
      </Grid>

      <Grid item className={filtersClasses.tool}>
        <StyledMTableToolbar
          {...toolbarProps}
          ref={toolbarRef}
          onSearchChanged={toolbarProps.onSearchChanged}
        />
      </Grid>
    </Grid>
  );
};
