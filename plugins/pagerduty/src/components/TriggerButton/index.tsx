/*
 * Copyright 2021 Spotify AB
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
import React, { useCallback, PropsWithChildren } from 'react';
import { createGlobalState } from 'react-use';
import { makeStyles, Button } from '@material-ui/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';

import { TriggerDialog } from '../TriggerDialog';
import { PAGERDUTY_INTEGRATION_KEY } from '../constants';

export interface TriggerButtonProps {
  design: 'link' | 'button';
  onIncidentCreated?: () => void;
}

const useStyles = makeStyles<BackstageTheme>(theme => ({
  buttonStyle: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  triggerAlarm: {
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: 1.2,
    lineHeight: 1.5,
    '&:hover, &:focus, &.focus': {
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
  },
}));

export const useShowDialog = createGlobalState(false);

export function TriggerButton({
  design,
  onIncidentCreated,
  children,
}: PropsWithChildren<TriggerButtonProps>) {
  const { buttonStyle, triggerAlarm } = useStyles();
  const { entity } = useEntity();
  const [dialogShown = false, setDialogShown] = useShowDialog();

  const showDialog = useCallback(() => {
    setDialogShown(true);
  }, [setDialogShown]);
  const hideDialog = useCallback(() => {
    setDialogShown(false);
  }, [setDialogShown]);

  const integrationKey = entity.metadata.annotations![
    PAGERDUTY_INTEGRATION_KEY
  ];

  return (
    <>
      <Button
        data-testid="trigger-button"
        {...(design === 'link' && { color: 'secondary' })}
        onClick={showDialog}
        className={design === 'link' ? triggerAlarm : buttonStyle}
      >
        {children ?? 'Create Incident'}
      </Button>
      <TriggerDialog
        showDialog={dialogShown}
        handleDialog={hideDialog}
        name={entity.metadata.name}
        integrationKey={integrationKey}
        onIncidentCreated={onIncidentCreated}
      />
    </>
  );
}
