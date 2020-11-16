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

import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { TriggerDialog } from '../TriggerDialog';
import { Entity } from '@backstage/catalog-model';
import { PAGERDUTY_INTEGRATION_KEY } from '../PagerDutyCard';

const useStyles = makeStyles({
  triggerAlarm: {
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: 1.2,
    lineHeight: 1.1,
    '&:hover, &:focus, &.focus': {
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
  },
});

type Props = {
  entity: Entity;
};

export const TriggerButton = ({ entity }: Props) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const classes = useStyles();

  const handleDialog = () => {
    setShowDialog(!showDialog);
  };

  return (
    <>
      <Button
        color="secondary"
        onClick={handleDialog}
        className={classes.triggerAlarm}
      >
        Trigger Alarm
      </Button>
      {showDialog && (
        <TriggerDialog
          name={entity.metadata.name}
          integrationKey={
            entity.metadata.annotations![PAGERDUTY_INTEGRATION_KEY]
          }
          onClose={handleDialog}
        />
      )}
    </>
  );
};
