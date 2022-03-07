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
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles({
  iconContainer: {
    display: 'flex',
    position: 'relative',
    width: '100%',
  },
  arrow1: {
    right: '6px',
    position: 'absolute',
  },
});

const DoubleArrowLeft = () => {
  const classes = useStyles();

  return (
    <div className={classes.iconContainer}>
      <div className={classes.arrow1}>
        <ArrowBackIosIcon style={{ fontSize: '12px' }} />
      </div>
      <div>
        <ArrowBackIosIcon style={{ fontSize: '12px' }} />
      </div>
    </div>
  );
};

export default DoubleArrowLeft;
