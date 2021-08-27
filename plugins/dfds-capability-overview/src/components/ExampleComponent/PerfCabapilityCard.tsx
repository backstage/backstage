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
import { makeStyles } from '@material-ui/core';
import { blue, green } from '@material-ui/core/colors';

import classNames from 'classnames';
import React from 'react';

const useStyles = makeStyles(theme => {
  return {
    gridBox: { marginBottom: theme.spacing(2) },
    card: {
      boxShadow: theme.shadows[1],
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
    },
    cardBox: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: theme.spacing(3),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderLeft: `3px solid transparent`,
    },
    cardBoxMember: { borderLeft: `3px solid ${blue[600]}` },
    statusBox: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
    },
    divider: { flex: 1 },
    displayFlexAlignCenter: { display: 'flex', alignItems: 'center' },
    dividerStyles: { marginLeft: 9, marginRight: 18 },
    statusBoxActions: { display: 'flex', marginLeft: theme.spacing(1) },
    availableIcon: { color: green[600], marginRight: 5 },
    colorGreen: { color: green[600], ...theme.typography.caption, margin: 0 },
    spacingLeft: { marginLeft: theme.spacing(1) },
    updatedAt: { ...theme.typography.caption, margin: 0 },
    cardTitle: { ...theme.typography.h5, margin: 0 },
  };
});

export const PerfCapabilityCard: React.FC<any> = React.memo(
  ({
    name = 'unknown name eror',
    description,
    isMember = false,
    updated,
    id,
  }) => {
    const classes = useStyles({ isMember });
    return (
      <div className={classes.gridBox}>
        <div className={classes.card}>
          <div
            className={classNames(
              classes.cardBox,
              isMember && classes.cardBoxMember,
            )}
          >
            <div>
              <h5 className={classes.cardTitle}>
                <a href={`/dfds-capability-management?id=${id}`}>{name}</a>
              </h5>
              <span className={classes.updatedAt}>{description}</span>
            </div>
            <div className={classes.divider} />
            <div className={classes.displayFlexAlignCenter}>
              {!isMember ? <button>Join</button> : <button>Leave</button>}
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)', height: 1 }} />
          <div className={classes.statusBox}>
            <span className={classes.updatedAt}>Status:</span>
            <div className={classes.statusBoxActions}>
              <caption className={classes.colorGreen}>✔ Available</caption>
            </div>
            <div className={classes.spacingLeft}>
              <span className={classes.updatedAt}>
                {updated || 'updated 2 hours ago'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
