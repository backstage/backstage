/*
 * Copyright 2022 The Backstage Authors
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

import { BackstageTheme } from '@backstage/theme';

import { Badge, Chip, makeStyles } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/CheckCircle';

import { EventAttendee, ResponseStatus } from '../../api';

const useStyles = makeStyles((theme: BackstageTheme) => {
  const getIconColor = (responseStatus?: string) => {
    if (!responseStatus) return theme.palette.primary.light;

    return {
      [ResponseStatus.accepted]: theme.palette.status.ok,
      [ResponseStatus.declined]: theme.palette.status.error,
    }[responseStatus];
  };

  return {
    responseStatus: {
      color: ({ responseStatus }: { responseStatus?: string }) =>
        getIconColor(responseStatus),
    },
    badge: {
      right: 10,
      top: 5,
      '& svg': {
        height: 16,
        width: 16,
        background: '#fff',
      },
    },
  };
});

const ResponseIcon = ({ responseStatus }: any) => {
  if (responseStatus === ResponseStatus.accepted) {
    return <CheckIcon data-testid="accepted-icon" />;
  }
  if (responseStatus === ResponseStatus.declined) {
    return <CancelIcon data-testid="declined-icon" />;
  }

  return null;
};

type AttendeeChipProps = {
  user: EventAttendee;
};

export const AttendeeChip = ({ user }: AttendeeChipProps) => {
  const classes = useStyles({ responseStatus: user.responseStatus });

  return (
    <Badge
      classes={{
        root: classes.responseStatus,
        badge: classes.badge,
      }}
      badgeContent={<ResponseIcon responseStatus={user.responseStatus} />}
    >
      <Chip
        size="small"
        variant="outlined"
        label={user.email}
        color="primary"
      />
    </Badge>
  );
};
