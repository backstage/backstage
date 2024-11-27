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
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { Pod } from 'kubernetes-models/v1/Pod';
import { DetectedError } from '@backstage/plugin-kubernetes-common';
import { PodLogs } from '../PodLogs';
import { Events } from '../Events';
import { LinkButton } from '@backstage/core-components';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }),
);

/**
 * Props for FixDialog
 *
 * @public
 */
export interface FixDialogProps {
  open?: boolean;
  clusterName: string;
  pod: Pod;
  error: DetectedError;
}

/**
 * A dialog for fixing detected Kubernetes errors
 *
 * @public
 */
export const FixDialog: React.FC<FixDialogProps> = ({
  open,
  pod,
  error,
  clusterName,
}: FixDialogProps) => {
  const [isOpen, setOpen] = useState(!!open);
  const classes = useStyles();

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const pf = error.proposedFix;

  const dialogContent = () => {
    return (
      <Grid container>
        <Grid xs={12}>
          <Typography variant="h6">Detected error:</Typography>
          <Typography>{error.message}</Typography>
        </Grid>
        <Grid xs={12}>
          <Typography variant="h6">Cause explanation:</Typography>
          <Typography>
            {error.proposedFix?.rootCauseExplanation ?? 'unknown'}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography variant="h6">Fix:</Typography>
          <List>
            {(error.proposedFix?.actions ?? []).map((fix, i) => {
              return (
                <ListItem key={`${pod.metadata?.name ?? 'unknown'}-pf-${i}`}>
                  {fix}
                </ListItem>
              );
            })}
          </List>
        </Grid>

        {pf && pf.type === 'logs' && (
          <>
            <Grid xs={12}>
              <Typography variant="h6">Crash logs:</Typography>
            </Grid>
            <Grid xs={9}>
              <PodLogs
                previous
                containerScope={{
                  podName: pod.metadata?.name ?? 'unknown',
                  podNamespace: pod.metadata?.namespace ?? 'unknown',
                  cluster: { name: clusterName },
                  containerName: pf.container,
                }}
              />
            </Grid>
          </>
        )}
        {pf && pf.type === 'events' && (
          <>
            <Grid xs={12}>
              <Typography variant="h6">Events:</Typography>
            </Grid>
            <Grid xs={9}>
              <Events
                warningEventsOnly
                involvedObjectName={pod.metadata?.name ?? ''}
                namespace={pod.metadata?.namespace ?? ''}
                clusterName={clusterName}
              />
            </Grid>
          </>
        )}
      </Grid>
    );
  };

  return (
    <>
      <Button
        variant="outlined"
        aria-label="fix issue"
        component="label"
        onClick={openDialog}
        startIcon={<HelpIcon />}
      >
        Help
      </Button>
      <Dialog maxWidth="xl" fullWidth open={isOpen} onClose={closeDialog}>
        <DialogTitle id="dialog-title">
          {pod.metadata?.name} - {error.type}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={closeDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{dialogContent()}</DialogContent>
        <DialogActions>
          {pf && pf.type === 'docs' && (
            <LinkButton
              to={pf.docsLink}
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              target="_blank"
              rel="noopener"
            >
              Open docs
            </LinkButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
