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

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 15,
  },
  path: {
    fill: '#7df3e1',
  },
});
const DoubleArrowRight = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <path
        d="M15.18 4.94408L14.236 4.00008L8.90266 9.33341L14.236 14.6667L15.18 13.7227L10.7907 9.33341L15.18 4.94408Z"
        fill="#BDBDBD"
      />
      <path
        d="M8.90271 4.94408L7.95871 4.00008L2.62538 9.33341L7.95871 14.6667L8.90271 13.7227L4.51338 9.33341L8.90271 4.94408Z"
        fill="#BDBDBD"
      />
    </svg>
  );
};

export default DoubleArrowRight;
