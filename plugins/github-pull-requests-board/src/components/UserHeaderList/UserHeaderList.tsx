import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { filterSameUser } from '../../utils/functions';

import { UserHeader } from '../UserHeader';
import { Author } from '../../utils/types';

type Props = {
  label?: string;
  users: Author[];
}

const UserHeaderList = (props: Props) => {
  const { users, label } = props;

  return (
    <Box display='flex' width='100%' alignItems='center' marginY={2} flexWrap='wrap'>
      {label && <Typography variant='subtitle2'>{label}</Typography>}
      {filterSameUser(users).map(({ login, avatarUrl }) => <UserHeader name={login} avatar={avatarUrl} key={login} />)}
    </Box>
  );
};

export default UserHeaderList;
