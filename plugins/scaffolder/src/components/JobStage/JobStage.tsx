/*
 * Copyright 2020 Spotify AB
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

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import cn from 'classnames';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { LogModal } from './LogModal';
import { Job } from '../../types';

const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));
moment.relativeTimeThreshold('ss', 0);

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    padding: 0,
  },
  button: {
    order: -1,
    margin: '0 1em 0 -20px',
  },
  cardContent: {
    backgroundColor: theme.palette.background.default,
  },
  accordion: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
  },
  neutral: {},
  failed: {
    '&:after': {
      boxShadow: `inset 4px 0px 0px ${theme.palette.error.main}`,
    },
  },
  started: {
    '&:after': {
      boxShadow: `inset 4px 0px 0px ${theme.palette.info.main}`,
    },
  },
  completed: {
    '&:after': {
      boxShadow: `inset 4px 0px 0px ${theme.palette.success.main}`,
    },
  },
  jobStatusTitle: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  },
}));

type Props = {
  name: string;
  className?: string;
  log: string[];
  startedAt: string;
  endedAt?: string;
  status: Job['status'];
};

export const JobStage = ({ endedAt, startedAt, name, log, status }: Props) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (status === 'FAILED') setExpanded(true);
  }, [status, setExpanded]);

  const timeElapsed =
    status !== 'PENDING'
      ? moment
          .duration(moment(endedAt ?? moment()).diff(moment(startedAt)))
          .humanize()
      : null;

  const [logsFullScreen, setLogsFullScreen] = useState(false);
  const toggleLogsFullScreen = () => setLogsFullScreen(!logsFullScreen);

  return (
    <Accordion
      TransitionProps={{ unmountOnExit: true }}
      className={cn(
        classes.accordion,
        classes[status.toLowerCase() as keyof ReturnType<typeof useStyles>] ??
          classes.neutral,
      )}
      expanded={expanded}
      onChange={(_, newState) => setExpanded(newState)}
    >
      <AccordionSummary
        expandIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button" className={classes.jobStatusTitle}>
          {name} {timeElapsed && `(${timeElapsed})`}{' '}
          {startedAt && !endedAt && <CircularProgress size="1em" />}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        {log.length === 0 ? (
          <Box px={9} pb={2} width="100%">
            No logs available for this step
          </Box>
        ) : (
          <Suspense fallback={<LinearProgress />}>
            <LogModal
              open={logsFullScreen}
              onClose={toggleLogsFullScreen}
              log={log}
            />
            <div style={{ height: '20vh', width: '100%' }}>
              <LazyLog text={`${log.join('\n')}`} extraLines={1} follow />
            </div>
          </Suspense>
        )}
      </AccordionDetails>
      <AccordionActions>
        <Button color="primary" onClick={toggleLogsFullScreen}>
          Open in fullscreen
        </Button>
      </AccordionActions>
    </Accordion>
  );
};
