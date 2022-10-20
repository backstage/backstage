/*
 * Copyright 2021 The Backstage Authors
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
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { ACCEPTED, AlertStatus, PENDING, RESOLVED } from '../../types';
import { alertStatusLabels } from './StatusChip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  label: {
    marginTop: 8,
    marginRight: 4,
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300,
  },
  grow: {
    flexGrow: 1,
  },
});

export const TableTitle = ({
  alertStates,
  onAlertStatesChange,
}: {
  alertStates: AlertStatus[];
  onAlertStatesChange: (states: AlertStatus[]) => void;
}) => {
  const classes = useStyles();
  const handleAlertStatusSelectChange = (event: any) => {
    onAlertStatesChange(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Typography noWrap className={classes.label}>
        Status:
      </Typography>
      <FormControl
        className={classes.formControl}
        variant="outlined"
        size="small"
      >
        <Select
          id="alerts-status-select"
          multiple
          value={alertStates}
          onChange={handleAlertStatusSelectChange}
          renderValue={(selected: any) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {[PENDING, ACCEPTED, RESOLVED].map(state => (
            <MenuItem key={state} value={state}>
              <Checkbox
                checked={alertStates.indexOf(state as AlertStatus) > -1}
              />
              <ListItemText primary={alertStatusLabels[state]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
