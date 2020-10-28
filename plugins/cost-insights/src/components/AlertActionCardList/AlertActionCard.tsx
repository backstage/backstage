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
import React from 'react';
import { Avatar, Card, CardHeader } from '@material-ui/core';
import { useScroll } from '../../hooks';
import { Alert } from '../../types';
import {
  useAlertActionCardHeader as useHeaderStyles,
  useAlertActionCardStyles as useStyles,
} from '../../utils/styles';

type AlertActionCardProps = {
  alert: Alert;
  number: number;
};

export const AlertActionCard = ({ alert, number }: AlertActionCardProps) => {
  const { scrollIntoView } = useScroll(`alert-${number}`);
  const headerClasses = useHeaderStyles();
  const classes = useStyles();

  return (
    <Card className={classes.card} raised={false} onClick={scrollIntoView}>
      <CardHeader
        classes={headerClasses}
        avatar={<Avatar className={classes.avatar}>{number}</Avatar>}
        title={alert.title}
        subheader={alert.subtitle}
      />
    </Card>
  );
};
