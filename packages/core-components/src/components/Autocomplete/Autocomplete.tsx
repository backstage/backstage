/*
 * Copyright 2024 The Backstage Authors
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

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import TextField, { OutlinedTextFieldProps } from '@material-ui/core/TextField';
import Grow from '@material-ui/core/Grow';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import React, { ReactNode, useCallback } from 'react';

const useStyles = makeStyles(
  theme => ({
    root: {},
    label: {
      position: 'relative',
      fontWeight: 'bold',
      fontSize: theme.typography.body2.fontSize,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      '& > span': {
        top: 0,
        left: 0,
        position: 'absolute',
      },
    },
    input: {},
  }),
  { name: 'BackstageAutocomplete' },
);

const BootstrapAutocomplete = withStyles(
  (theme: Theme) =>
    createStyles({
      root: {},
      paper: {
        margin: 0,
      },
      hasClearIcon: {},
      hasPopupIcon: {},
      focused: {},
      inputRoot: {
        marginTop: 24,
        backgroundColor: theme.palette.background.paper,
        '$root$hasClearIcon$hasPopupIcon &': {
          paddingBlock: theme.spacing(1.5625),
          paddingInlineStart: theme.spacing(1.5),
        },
        '$root$focused &': {
          outline: 'none',
        },
        '$root &:hover > fieldset': {
          borderColor: '#ced4da',
        },
        '$root$focused & > fieldset': {
          borderWidth: 1,
          borderColor: theme.palette.primary.main,
        },
      },
      popupIndicator: {
        padding: 0,
        margin: 0,
        color: '#616161',
        '& [class*="MuiTouchRipple-root"]': {
          display: 'none',
        },
      },
      endAdornment: {
        '$root$hasClearIcon$hasPopupIcon &': {
          right: 4,
        },
      },
      input: {
        '$root$hasClearIcon$hasPopupIcon &': {
          fontSize: theme.typography.body1.fontSize,
          padding: 0,
        },
      },
    }),
  { name: 'BackstageAutocompleteBase' },
)(Autocomplete) as typeof Autocomplete;

const PopperComponent = (props: PopperProps) => (
  <Popper {...props} transition placement="bottom-start">
    {({ TransitionProps }) => (
      <Grow {...TransitionProps} style={{ transformOrigin: '0 0 0' }}>
        <Box>{props.children as ReactNode}</Box>
      </Grow>
    )}
  </Popper>
);

const PaperComponent = (props: PaperProps) => (
  <Paper {...props} elevation={8} />
);

export type AutocompleteComponentProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> = {
  name: string;
  label?: string;
  inputProps?: Omit<OutlinedTextFieldProps, 'variant'>;
  renderInput?: AutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >['renderInput'];
} & Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'PopperComponent' | 'PaperComponent' | 'popupIcon'
>;

/** @public */
export function AutocompleteComponent<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(props: AutocompleteComponentProps<T, Multiple, DisableClearable, FreeSolo>) {
  const { label, name, inputProps, ...rest } = props;
  const classes = useStyles();
  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...inputProps}
        {...params}
        className={classes.input}
        variant="outlined"
      />
    ),
    [],
  );
  const autocomplete = (
    <BootstrapAutocomplete
      size="small"
      {...rest}
      renderInput={rest.renderInput ?? renderInput}
      popupIcon={<ExpandMoreIcon data-testid={`${name}-expand`} />}
      PaperComponent={PaperComponent}
      PopperComponent={PopperComponent}
    />
  );

  return (
    <Box className={classes.root}>
      {label ? (
        <Typography className={classes.label} component="label">
          <Box component="span">{label}</Box>
          {autocomplete}
        </Typography>
      ) : (
        autocomplete
      )}
    </Box>
  );
}
