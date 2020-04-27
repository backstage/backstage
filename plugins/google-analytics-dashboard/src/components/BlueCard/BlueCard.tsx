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
import { Typography, makeStyles, Card, Divider } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    color: 'white',
    backgroundColor: '#4285f4',
  },
  heading: {
    fontWeight: 700,
    padding: '16px 16px 16px 20px',
  },
});

const BlueCard: FC<{ title: string }> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Typography variant="h5" className={classes.heading}>
        {title}
      </Typography>
      <Divider />
      {children}
    </Card>
  );
};

export default BlueCard;
