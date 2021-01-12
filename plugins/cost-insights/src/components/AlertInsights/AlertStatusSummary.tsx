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

import React, { Fragment } from 'react';
import { Avatar, Box, Collapse, Divider } from '@material-ui/core';
import { default as AcceptIcon } from '@material-ui/icons/Check';
import { default as DismissIcon } from '@material-ui/icons/Delete';
import { default as SnoozeIcon } from '@material-ui/icons/AccessTime';
import { ActionItemCard } from '../ActionItems';
import { Alert, AlertStatus } from '../../types';
import { useActionItemCardStyles as useStyles } from '../../utils/styles';

type AlertStatusSummaryProps = {
  open: boolean;
  snoozed: Alert[];
  accepted: Alert[];
  dismissed: Alert[];
};

export const AlertStatusSummary = ({
  open,
  snoozed,
  accepted,
  dismissed,
}: AlertStatusSummaryProps) => {
  const classes = useStyles();

  const isSnoozedListDisplayed = !!snoozed.length;
  const isAcceptedListDisplayed = !!accepted.length;
  const isDismissedListDisplayed = !!dismissed.length;

  return (
    <Collapse in={open}>
      {isAcceptedListDisplayed && (
        <Box p={1}>
          {accepted.map((alert, index) => (
            <Fragment key={`alert-accepted-${index}`}>
              <ActionItemCard
                disableScroll
                alert={alert}
                avatar={
                  <Avatar className={classes.avatar}>
                    {/* Icons indicate alert status. Do not hide from accesibility tree */}
                    <AcceptIcon
                      aria-hidden={false}
                      role="img"
                      aria-label={AlertStatus.Accepted}
                    />
                  </Avatar>
                }
              />
              {index < accepted.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Box>
      )}
      {isSnoozedListDisplayed && (
        <Box p={1}>
          {snoozed.map((alert, index) => (
            <Fragment key={`alert-accepted-${index}`}>
              <ActionItemCard
                disableScroll
                alert={alert}
                avatar={
                  <Avatar className={classes.avatar}>
                    <SnoozeIcon
                      aria-hidden={false}
                      role="img"
                      aria-label={AlertStatus.Snoozed}
                    />
                  </Avatar>
                }
              />
              {index < snoozed.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Box>
      )}
      {isDismissedListDisplayed && (
        <Box p={1}>
          {dismissed.map((alert, index) => (
            <Fragment key={`alert-dismissed-${index}`}>
              <ActionItemCard
                disableScroll
                alert={alert}
                avatar={
                  <Avatar className={classes.avatar}>
                    <DismissIcon
                      aria-hidden={false}
                      role="img"
                      aria-label={AlertStatus.Dismissed}
                    />
                  </Avatar>
                }
              />
              {index < dismissed.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Box>
      )}
    </Collapse>
  );
};
