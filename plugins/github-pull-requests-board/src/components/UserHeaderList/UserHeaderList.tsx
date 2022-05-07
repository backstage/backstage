/*
 * Copyright 2022 The Backstage Authors
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
import React, { FunctionComponent } from 'react';
import { Typography, Box } from '@material-ui/core';
import { filterSameUser } from '../../utils/functions';

import { UserHeader } from '../UserHeader';
import { Author } from '../../utils/types';

type Props = {
  label?: string;
  users: Author[];
};

const UserHeaderList: FunctionComponent<Props> = (props: Props) => {
  const { users, label } = props;

  return (
    <Box
      display="flex"
      width="100%"
      alignItems="center"
      marginY={2}
      flexWrap="wrap"
    >
      {label && <Typography variant="subtitle2">{label}</Typography>}
      {filterSameUser(users).map(({ login, avatarUrl }) => (
        <UserHeader name={login} avatar={avatarUrl} key={login} />
      ))}
    </Box>
  );
};

export default UserHeaderList;
