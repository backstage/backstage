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

import { Entity } from '@backstage/catalog-model';
import { LogViewer } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { readGitHubIntegrationConfigs } from '@backstage/integration';
import {
  Accordion,
  AccordionSummary,
  CircularProgress,
  Fade,
  makeStyles,
  Modal,
  Theme,
  Tooltip,
  Typography,
  Zoom,
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { getProjectNameFromEntity } from '../getProjectNameFromEntity';
import { useDownloadWorkflowRunLogs } from './useDownloadWorkflowRunLogs';

const useStyles = makeStyles<Theme>(theme => ({
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    width: '85%',
    height: '85%',
    justifyContent: 'center',
    margin: 'auto',
  },
  normalLogContainer: {
    height: '75vh',
    width: '100%',
  },
  modalLogContainer: {
    height: '100%',
    width: '100%',
  },
  log: {
    background: theme.palette.background.default,
  },
}));

/**
 * A component for Run Logs visualization.
 */
export const WorkflowRunLogs = ({
  entity,
  runId,
  inProgress,
}: {
  entity: Entity;
  runId: number;
  inProgress: boolean;
}) => {
  const config = useApi(configApiRef);
  const classes = useStyles();
  const projectName = getProjectNameFromEntity(entity);

  // TODO: Get github hostname from metadata annotation
  const hostname = readGitHubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  )[0].host;
  const [owner, repo] = (projectName && projectName.split('/')) || [];
  const jobLogs = useDownloadWorkflowRunLogs({
    hostname,
    owner,
    repo,
    id: runId,
  });
  const logText = jobLogs.value ? String(jobLogs.value) : undefined;
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} disabled={inProgress}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {jobLogs.loading ? <CircularProgress /> : 'Job Log'}
        </Typography>
        <Tooltip title="Open Log" TransitionComponent={Zoom} arrow>
          <DescriptionIcon
            onClick={event => {
              event.stopPropagation();
              handleOpen();
            }}
            style={{ marginLeft: 'auto' }}
          />
        </Tooltip>
        <Modal
          className={classes.modal}
          onClick={event => event.stopPropagation()}
          open={open}
          onClose={handleClose}
        >
          <Fade in={open}>
            <div className={classes.modalLogContainer}>
              <LogViewer
                text={logText ?? 'No Values Found'}
                classes={{ root: classes.log }}
              />
            </div>
          </Fade>
        </Modal>
      </AccordionSummary>
      {logText && (
        <div className={classes.normalLogContainer}>
          <LogViewer text={logText} classes={{ root: classes.log }} />
        </div>
      )}
    </Accordion>
  );
};
