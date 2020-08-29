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
import React, { useState, FC, Suspense, useEffect } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  LinearProgress,
} from '@material-ui/core';
import moment from 'moment';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import LinePart from 'react-lazylog/build/LinePart';
const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));
moment.relativeTimeThreshold('ss', 0);
const useStyles = makeStyles(theme => ({
  expansionPanelDetails: {
    padding: 0,
  },
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
  neutral: {},
  failed: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.error.main}`,
    },
  },
  running: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.info.main}`,
    },
  },
  cardContent: {
    backgroundColor: theme.palette.background.default,
  },
  success: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      color: 'green',
      boxShadow: `inset 4px 0px 0px ${theme.palette.success.main}`,
    },
  },
}));

const pickClassName = (
    classes: ReturnType<typeof useStyles>,
    build: any,
  ) => {
    if (build === 'failed') return classes.failed;
    if (['running', 'queued'].includes(build!)) return classes.running;
    if (build === 'success') return classes.success;
    return classes.neutral;
  };

const timeElapsed = (
    start: string,
    end: string,
    humanize: boolean = false
) => {
    if(humanize){
        return moment.duration(
            moment(start|| moment()).diff(moment(end)),
        ).humanize();
    }else{
        return moment.duration(
            moment(start|| moment()).diff(moment(end)),
        ).asSeconds();
    }
}

export const BuildSteps: FC<{
    runData: {
        jobName: string,
        jobStart: string,
        jobEnd: string,
        jobStatus: string,
        steps: Array<any>
    };
}> = ({ runData }) => {
    const classes = useStyles();
    const [messages, setMessages] = useState([] as any);

    useEffect(() => {
        if(runData.steps !== undefined){
            setMessages(runData.steps.map(
                ({ name, completed_at, started_at }: {
                     name: string; completed_at: string; started_at: string; 
                    }) => `${name} ${timeElapsed(started_at, completed_at)}s`
            ));
        }
    }, [runData.steps])

  return (
    <ExpansionPanel
      TransitionProps={{ unmountOnExit: true }}
      className={pickClassName(classes, runData.jobStatus)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${runData.jobName}-content`}
        id={`panel-${runData.jobName}-header`}
      >
        {
        runData.jobStatus == 'success' ?
        <CheckCircleRoundedIcon style={{ color: 'lime' }}/> 
        : <ErrorRoundedIcon style={{ color: 'red' }}/>
        }   
        <Typography variant="button">
          {runData.jobName || "No Run Logs"} {`(${timeElapsed(runData.jobStart, runData.jobEnd, true)})` || ""}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        {messages.length === 0 ? (
          'Nothing here...'
        ) : (
          <Suspense fallback={<LinearProgress />}>
            <div style={{ height: '25vh', width: '100%' }}>
              <LazyLog 
              text={messages.join('\n')} 
              extraLines={1} 
              caseInsensitive={true}
              enableSearch
              formatPart={(line) => {
                if(line.toLocaleLowerCase().includes("error") 
                || line.toLocaleLowerCase().includes("failed")
                || line.toLocaleLowerCase().includes("failure"))
                {
                    return <LinePart style={{color: 'red'}} part={{text: line}}/>
                }
                return line;
              }}
              />
            </div>
          </Suspense>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
