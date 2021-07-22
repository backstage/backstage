/*
 * Copyright 2020 The Backstage Authors
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

import { BackstageTheme } from '@backstage/theme';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

const getWarningTextColor = (
  severity: Props['severity'],
  theme: BackstageTheme,
) => {
  switch (severity) {
    case 'error':
      return theme.palette.errorText;
    case 'info':
      return theme.palette.infoText;
    default:
      return theme.palette.warningText;
  }
};

const getWarningBackgroundColor = (
  severity: Props['severity'],
  theme: BackstageTheme,
) => {
  switch (severity) {
    case 'error':
      return theme.palette.errorBackground;
    case 'info':
      return theme.palette.infoBackground;
    default:
      return theme.palette.warningBackground;
  }
};

const useErrorOutlineStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    marginRight: theme.spacing(1),
    fill: ({ severity }: Props) => getWarningTextColor(severity, theme),
  },
}));

const ErrorOutlineStyled = ({ severity }: Pick<Props, 'severity'>) => {
  const classes = useErrorOutlineStyles({ severity });
  return <ErrorOutline classes={classes} />;
};
const ExpandMoreIconStyled = ({ severity }: Pick<Props, 'severity'>) => {
  const classes = useErrorOutlineStyles({ severity });
  return <ExpandMoreIcon classes={classes} />;
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  panel: {
    backgroundColor: ({ severity }: Props) =>
      getWarningBackgroundColor(severity, theme),
    color: ({ severity }: Props) => getWarningTextColor(severity, theme),
    verticalAlign: 'middle',
  },
  summary: {
    display: 'flex',
    flexDirection: 'row',
  },
  summaryText: {
    color: ({ severity }: Props) => getWarningTextColor(severity, theme),
    fontWeight: 'bold',
  },
  message: {
    width: '100%',
    display: 'block',
    color: ({ severity }: Props) => getWarningTextColor(severity, theme),
    backgroundColor: ({ severity }: Props) =>
      getWarningBackgroundColor(severity, theme),
  },
  details: {
    width: '100%',
    display: 'block',
    color: theme.palette.textContrast,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.border}`,
    padding: theme.spacing(2.0),
    fontFamily: 'sans-serif',
  },
}));

type Props = {
  title?: string;
  severity?: 'warning' | 'error' | 'info';
  message?: React.ReactNode;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

const capitalize = (s: string) => {
  return s.charAt(0).toLocaleUpperCase('en-US') + s.slice(1);
};

/**
 * WarningPanel. Show a user friendly error message to a user similar to ErrorPanel except that the warning panel
 * only shows the warning message to the user.
 *
 * @param {string} [severity=warning] Ability to change the severity of the alert.
 * @param {string} [title] A title for the warning. If not supplied, "Warning" will be used.
 * @param {Object} [message] Optional more detailed user-friendly message elaborating on the cause of the error.
 * @param {Object} [children] Objects to provide context, such as a stack trace or detailed error reporting.
 * Will be available inside an unfolded accordion.
 */
export const WarningPanel = (props: Props) => {
  const classes = useStyles(props);
  const {
    severity = 'warning',
    title,
    message,
    children,
    defaultExpanded,
  } = props;

  // If no severity or title provided, the heading will read simply "Warning"
  const subTitle = capitalize(severity) + (title ? `: ${title}` : '');

  return (
    <Accordion
      defaultExpanded={defaultExpanded ?? false}
      className={classes.panel}
      role="alert"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIconStyled severity={severity} />}
        className={classes.summary}
      >
        <ErrorOutlineStyled severity={severity} />
        <Typography className={classes.summaryText} variant="subtitle1">
          {subTitle}
        </Typography>
      </AccordionSummary>
      {(message || children) && (
        <AccordionDetails>
          <Grid container>
            {message && (
              <Grid item xs={12}>
                <Typography className={classes.message} variant="body1">
                  {message}
                </Typography>
              </Grid>
            )}
            {children && (
              <Grid item xs={12} className={classes.details}>
                {children}
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      )}
    </Accordion>
  );
};
