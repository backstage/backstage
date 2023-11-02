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
import { LogViewer } from '@backstage/core-components';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useApp } from '@backstage/core-plugin-api';
import { durationHumanized } from '../../../../util';
import { useStepOutput } from '../../../../hooks';
import { BuildStepAction } from '../../../../types';

const useStyles = makeStyles({
  accordionDetails: {
    padding: 5,
    paddingBottom: 20,
  },
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
});

export const OutputViewer = ({
  action,
  buildNumber,
}: {
  action: BuildStepAction;
  buildNumber: number;
}) => {
  const { Progress } = useApp().getComponents();
  const { loading, output } = useStepOutput(
    buildNumber,
    action.step,
    action.index,
  );

  return (
    <div style={{ height: '40vh', width: '100%' }}>
      {loading && <Progress />}
      <LogViewer text={output || 'Nothing here...'} />
    </div>
  );
};

export const ActionOutput = ({
  className,
  action,
  buildNumber,
}: {
  className?: string;
  action: BuildStepAction;
  buildNumber: number;
}) => {
  const classes = useStyles();
  const timeElapsed = durationHumanized(action.start_time, action.end_time);

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} className={className}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${action.name}-content`}
        id={`panel-${action.name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {action.name} ({timeElapsed})
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <OutputViewer action={action} buildNumber={buildNumber} />
      </AccordionDetails>
    </Accordion>
  );
};
