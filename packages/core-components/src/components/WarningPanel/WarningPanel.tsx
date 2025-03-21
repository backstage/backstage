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

import { makeStyles, darken, lighten, Theme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { MarkdownContent } from '../MarkdownContent';

const getWarningTextColor = (
  severity: NonNullable<WarningProps['severity']>,
  theme: Theme,
) => {
  const getColor = theme.palette.type === 'light' ? darken : lighten;
  return getColor(theme.palette[severity].light, 0.6);
};

const getWarningBackgroundColor = (
  severity: NonNullable<WarningProps['severity']>,
  theme: Theme,
) => {
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;
  return getBackgroundColor(theme.palette[severity].light, 0.9);
};

const useErrorOutlineStyles = makeStyles(theme => ({
  root: {
    marginRight: theme.spacing(1),
    fill: ({ severity }: WarningProps) =>
      getWarningTextColor(
        severity as NonNullable<WarningProps['severity']>,
        theme,
      ),
  },
}));

const ErrorOutlineStyled = ({ severity }: Pick<WarningProps, 'severity'>) => {
  const classes = useErrorOutlineStyles({ severity });
  return <ErrorOutline classes={classes} />;
};
const ExpandMoreIconStyled = ({ severity }: Pick<WarningProps, 'severity'>) => {
  const classes = useErrorOutlineStyles({ severity });
  return <ExpandMoreIcon classes={classes} />;
};

export type WarningPanelClassKey =
  | 'panel'
  | 'summary'
  | 'summaryText'
  | 'message'
  | 'details';

const useStyles = makeStyles(
  theme => ({
    panel: {
      backgroundColor: ({ severity }: WarningProps) =>
        getWarningBackgroundColor(
          severity as NonNullable<WarningProps['severity']>,
          theme,
        ),
      color: ({ severity }: WarningProps) =>
        getWarningTextColor(
          severity as NonNullable<WarningProps['severity']>,
          theme,
        ),
      verticalAlign: 'middle',
    },
    summary: {
      display: 'flex',
      flexDirection: 'row',
    },
    summaryText: {
      color: ({ severity }: WarningProps) =>
        getWarningTextColor(
          severity as NonNullable<WarningProps['severity']>,
          theme,
        ),
      fontWeight: theme.typography.fontWeightBold,
    },
    markdownContent: {
      '& p': {
        display: 'inline',
      },
    },
    message: {
      width: '100%',
      display: 'block',
      color: ({ severity }: WarningProps) =>
        getWarningTextColor(
          severity as NonNullable<WarningProps['severity']>,
          theme,
        ),
      backgroundColor: ({ severity }: WarningProps) =>
        getWarningBackgroundColor(
          severity as NonNullable<WarningProps['severity']>,
          theme,
        ),
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
  }),
  { name: 'BackstageWarningPanel' },
);

export type WarningProps = {
  title?: string;
  severity?: 'warning' | 'error' | 'info';
  titleFormat?: string;
  message?: React.ReactNode;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

const capitalize = (s: string) => {
  return s.charAt(0).toLocaleUpperCase('en-US') + s.slice(1);
};

/**
 * Show a user friendly error message to a user similar to
 * ErrorPanel except that the warning panel only shows the warning message to
 * the user.
 *
 * @param severity - Ability to change the severity of the alert. Default value
 *        "warning"
 * @param title - A title for the warning. If not supplied, "Warning" will be
 *        used.
 * @param message - Optional more detailed user-friendly message elaborating on
 *        the cause of the error.
 * @param children - Objects to provide context, such as a stack trace or detailed
 *        error reporting. Will be available inside an unfolded accordion.
 */
export function WarningPanel(props: WarningProps) {
  const {
    severity = 'warning',
    title,
    titleFormat,
    message,
    children,
    defaultExpanded,
  } = props;
  const classes = useStyles({ severity });

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
          {titleFormat === 'markdown' ? (
            <MarkdownContent
              content={subTitle}
              className={classes.markdownContent}
            />
          ) : (
            subTitle
          )}
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
}
