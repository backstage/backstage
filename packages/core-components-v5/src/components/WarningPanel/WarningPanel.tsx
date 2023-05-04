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
import React from 'react';

import ErrorOutline from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Theme, darken, lighten } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

const getWarningTextColor = (
  severity: NonNullable<WarningProps['severity']>,
  theme: Theme,
) => {
  const getColor = theme.palette.mode === 'light' ? darken : lighten;
  return getColor(theme.palette[severity].light, 0.6);
};

const getWarningBackgroundColor = (
  severity: NonNullable<WarningProps['severity']>,
  theme: Theme,
) => {
  const getBackgroundColor = theme.palette.mode === 'light' ? lighten : darken;
  return getBackgroundColor(theme.palette[severity].light, 0.9);
};

const useErrorOutlineStyles = makeStyles<WarningProps>()(
  (theme, { severity }) => ({
    root: {
      marginRight: theme.spacing(1),
      fill: getWarningTextColor(
        severity as NonNullable<WarningProps['severity']>,
        theme,
      ),
    },
  }),
);

const ErrorOutlineStyled = ({ severity }: Pick<WarningProps, 'severity'>) => {
  const { classes } = useErrorOutlineStyles({ severity });
  return <ErrorOutline classes={classes} />;
};
const ExpandMoreIconStyled = ({ severity }: Pick<WarningProps, 'severity'>) => {
  const { classes } = useErrorOutlineStyles({ severity });
  return <ExpandMoreIcon classes={classes} />;
};

export type WarningPanelClassKey =
  | 'panel'
  | 'summary'
  | 'summaryText'
  | 'message'
  | 'details';

const useStyles = makeStyles<WarningProps>({ name: 'BackstageWarningPanel' })(
  (theme, { severity }) => ({
    panel: {
      backgroundColor: getWarningBackgroundColor(
        severity as NonNullable<WarningProps['severity']>,
        theme,
      ),
      color: getWarningTextColor(
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
      color: getWarningTextColor(
        severity as NonNullable<WarningProps['severity']>,
        theme,
      ),
      fontWeight: theme.typography.fontWeightBold,
    },
    message: {
      width: '100%',
      display: 'block',
      color: getWarningTextColor(
        severity as NonNullable<WarningProps['severity']>,
        theme,
      ),
      backgroundColor: getWarningBackgroundColor(
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
);

export type WarningProps = {
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
    message,
    children,
    defaultExpanded,
  } = props;
  const { classes } = useStyles({ severity });

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
}
