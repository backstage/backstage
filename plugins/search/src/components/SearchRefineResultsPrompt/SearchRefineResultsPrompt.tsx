/*
 * Copyright 2021 The Backstage Authors
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

import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    margin: '1rem 0',
  },
});

export const SearchRefineResultsPrompt = () => {
  const classes = useStyles();

  return (
    <Typography
      className={classes.root}
      variant="body2"
      color="textSecondary"
      display="block"
      align="center"
    >
      Search is limited to a fixed number of results. You can try refining your
      search query if you're not finding what you're looking for.
    </Typography>
  );
};
