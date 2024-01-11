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

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '../../components/Link';
import { CopyTextButton, WarningPanel } from '../../components';
import { useSupportConfig } from '../../hooks';
import { MicDrop } from './MicDrop';

interface IErrorPageProps {
  status?: string;
  statusMessage: string;
  additionalInfo?: React.ReactNode;
  supportUrl?: string;
  stack?: string;
}

/** @public */
export type ErrorPageClassKey = 'container' | 'title' | 'subtitle';

const useStyles = makeStyles(
  theme => ({
    parent: {
      padding: theme.spacing(8),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2),
      },
    },
    container: {
      marginBottom: theme.spacing(5),
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(4),
      },
    },
    title: {
      paddingBottom: theme.spacing(5),
      [theme.breakpoints.down('xs')]: {
        paddingBottom: theme.spacing(4),
        fontSize: theme.typography.h3.fontSize,
      },
    },
    subtitle: {
      color: theme.palette.textSubtle,
    },
    text: {
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      overflowX: 'auto',
      marginRight: theme.spacing(2),
    },
    copyTextContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
  }),
  { name: 'BackstageErrorPage' },
);

/**
 * Error page with status and description
 *
 * @public
 *
 */
export function ErrorPage(props: IErrorPageProps) {
  const { status, statusMessage, additionalInfo, supportUrl, stack } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const support = useSupportConfig();

  return (
    <Box className={classes.parent}>
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={8} md={4}>
          <Typography
            data-testid="error"
            variant="body1"
            className={classes.subtitle}
          >
            ERROR {status}: {statusMessage}
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            {additionalInfo}
          </Typography>
          <Typography variant="h2" className={classes.title}>
            Looks like someone dropped the mic!
          </Typography>
          <Typography variant="h6">
            <Link
              to="#"
              data-testid="go-back-link"
              onClick={() => navigate(-1)}
            >
              Go back
            </Link>
            ... or please{' '}
            <Link to={supportUrl || support.url}>contact support</Link> if you
            think this is a bug.
          </Typography>
        </Grid>
        <MicDrop />
      </Grid>
      {stack && (
        <WarningPanel severity="error" title={statusMessage}>
          <Grid container className={classes.container}>
            <Grid item xs={10} sm={8}>
              <Typography variant="subtitle1">Stack Trace</Typography>
              <Typography
                className={classes.text}
                color="error"
                variant="body1"
              >
                {stack}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} className={classes.copyTextContainer}>
              <CopyTextButton text={stack} />
            </Grid>
          </Grid>
        </WarningPanel>
      )}
    </Box>
  );
}
