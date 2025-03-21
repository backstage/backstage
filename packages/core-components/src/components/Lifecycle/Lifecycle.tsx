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
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CSS from 'csstype';
import React from 'react';

type Props = CSS.Properties & {
  shorthand?: boolean;
  alpha?: boolean;
};

export type LifecycleClassKey = 'alpha' | 'beta';

const useStyles = makeStyles(
  theme => ({
    alpha: {
      color: theme.palette.common.white,
      fontFamily: 'serif',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    beta: {
      color: '#4d65cc',
      fontFamily: 'serif',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  }),
  { name: 'BackstageLifecycle' },
);

export function Lifecycle(props: Props) {
  const classes = useStyles(props);
  const { shorthand, alpha } = props;
  return shorthand ? (
    <Typography
      component="span"
      className={classes[alpha ? 'alpha' : 'beta']}
      style={{ fontSize: '120%' }}
    >
      {alpha ? <>&alpha;</> : <>&beta;</>}
    </Typography>
  ) : (
    <Typography component="span" className={classes[alpha ? 'alpha' : 'beta']}>
      {alpha ? 'Alpha' : 'Beta'}
    </Typography>
  );
}
