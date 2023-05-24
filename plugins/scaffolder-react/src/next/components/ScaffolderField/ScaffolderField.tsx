/*
 * Copyright 2023 The Backstage Authors
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
import React, { PropsWithChildren, ReactElement } from 'react';

import { MarkdownContent } from '@backstage/core-components';
import { FormControl, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  markdownDescription: {
    fontSize: theme.typography.caption.fontSize,
    margin: 0,
    color: theme.palette.text.secondary,
    '& :first-child': {
      margin: 0,
      marginTop: '3px', // to keep the standard browser padding
    },
  },
}));

/**
 * Props for the {@link ScaffolderField} component
 * @alpha
 */
export interface ScaffolderFieldProps {
  rawDescription?: string;
  errors?: ReactElement;
  rawErrors?: string[];
  help?: ReactElement;
  rawHelp?: string;
  required?: boolean;
  disabled: boolean;
  displayLabel?: boolean;
}

/**
 * A component to wrap up a input field which helps with formatting and supporting markdown
 * on the field types
 * @alpha
 */
export const ScaffolderField = (
  props: PropsWithChildren<ScaffolderFieldProps>,
) => {
  const {
    children,
    displayLabel = true,
    rawErrors = [],
    errors,
    help,
    rawDescription,
    required,
    disabled,
  } = props;
  const classes = useStyles();
  return (
    <FormControl
      fullWidth
      error={rawErrors.length ? true : false}
      required={required}
      disabled={disabled}
    >
      {children}
      {displayLabel && rawDescription ? (
        <MarkdownContent
          content={rawDescription}
          className={classes.markdownDescription}
        />
      ) : null}
      {errors}
      {help}
    </FormControl>
  );
};
