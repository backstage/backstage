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

import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core';
import NotFoundImage from './NotFoundImage';

const useStyles = makeStyles({
  mainBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  },
  text404: {
    fontSize: '80px',
    color: '#707070',
  },
  textNotFound: {
    fontSize: '32px',
    color: '#BFBFBF',
  },
});

const NotFoundComponent: FC<{}> = () => {
  const style = useStyles();
  return (
    <div data-testid="not-found-element" className={style.mainBody}>
      <NotFoundImage />
      <span className={style.text404}>404</span>
      <span data-testid="page-not-found" className={style.textNotFound}>
        Page not found
      </span>
    </div>
  );
};

export default NotFoundComponent;
