/*
 * Copyright 2022 The Backstage Authors
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
import React from 'react';
import {
  Button,
  ButtonGroup,
  Typography,
  Grid,
  capitalize,
  makeStyles,
} from '@material-ui/core';

export enum ViewMode {
  MODE_TABLE = 'table',
  MODE_GRID = 'grid',
}

const useViewModePickerStyles = makeStyles({
  title: {
    paddingBottom: '0 !important',
  },
  selector: {
    paddingTop: '0 !important',
  },
});

export interface ViewModePickerProps {
  selected: ViewMode;
  onChange: (mode: ViewMode) => void;
}
export const ViewModePicker = ({ selected, onChange }: ViewModePickerProps) => {
  const classes = useViewModePickerStyles();
  return (
    <Grid container direction="column">
      <Grid item className={classes.title}>
        <Typography variant="button">View Mode</Typography>
      </Grid>
      <Grid item className={classes.selector}>
        <ButtonGroup variant="outlined">
          {Object.values(ViewMode).map(mode => (
            <Button
              key={mode}
              onClick={() => onChange(mode)}
              color={mode === selected ? 'primary' : 'default'}
              variant={mode === selected ? 'contained' : 'outlined'}
            >
              {capitalize(mode)}
            </Button>
          ))}
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};
