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
        d="M0.82 11.0559L1.764 11.9999L7.09733 6.66658L1.764 1.33325L0.82 2.27725L5.20933 6.66658L0.82 11.0559Z"
        fill="#BDBDBD"
      />
      <path
        d="M7.0973 11.0559L8.0413 11.9999L13.3746 6.66658L8.0413 1.33325L7.0973 2.27725L11.4866 6.66658L7.0973 11.0559Z"
        fill="#BDBDBD"
      />
    </svg>
  );
};

export default DoubleArrowRight;
