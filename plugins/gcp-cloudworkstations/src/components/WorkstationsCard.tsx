/*
 * Copyright 2024 The Backstage Authors
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
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import React from 'react';
import { WorkstationsContent } from './WorkstationsContent';

const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  fullHeightCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gridItemCardContent: {
    flex: 1,
  },
  fullHeightCardContent: {
    flex: 1,
  },
});

export function WorkstationsCard() {
  const classes = useStyles();

  let currentRef: { refreshWorkstationsData: () => void } | null;

  return (
    <Card className={classes.gridItemCard}>
      <CardHeader
        title="GCP Cloud Workstations"
        action={
          <>
            <IconButton
              aria-label="Refresh"
              title="Schedule workstations refresh"
              onClick={() => {
                currentRef?.refreshWorkstationsData();
              }}
            >
              <CachedIcon />
            </IconButton>
          </>
        }
      />
      <Divider />
      <CardContent className={classes.gridItemCardContent}>
        <WorkstationsContent
          ref={ref => {
            currentRef = ref;
          }}
        />
      </CardContent>
    </Card>
  );
}
