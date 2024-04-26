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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { upperFirst } from 'lodash';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Typography from '@material-ui/core/Typography';
import { toVerboseTimeRange } from '../util';

const useStyles = makeStyles({
  root: {
    '& > * + *': {
      marginTop: 2,
    },
  },
  link: {
    cursor: 'pointer',
  },
});

const Subtitle = ({ report }) => {
  const classes = useStyles();

  const { aggregateBy, window } = report;

  return (
    <div className={classes.root}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {aggregateBy && aggregateBy.length > 0 ? (
          <Typography>
            {toVerboseTimeRange(window)} by {upperFirst(aggregateBy)}
          </Typography>
        ) : (
          <Typography>{toVerboseTimeRange(window)}</Typography>
        )}
      </Breadcrumbs>
    </div>
  );
};

export default React.memo(Subtitle);
