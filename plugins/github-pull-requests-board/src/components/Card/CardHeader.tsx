import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { getElapsedTime } from '../../utils/functions';
import { UserHeader } from '../UserHeader';

type Props = {
  title: string;
  createdAt: string;
  updatedAt?: string;
  authorName: string;
  authorAvatar?: string;
  repositoryName: string;
}

const CardHeader = (props: Props) => {
  const {
    title,
    createdAt,
    updatedAt,
    authorName,
    authorAvatar,
    repositoryName,
  } = props;

  return (
    <>
      <Box display='flex' justifyContent='space-between'>
        <Typography color='textSecondary' variant='body2' component='p'>
          {repositoryName}
        </Typography>
        <UserHeader name={authorName} avatar={authorAvatar} />
      </Box>
      <Typography component='h3'>
        <b>{title}</b>
      </Typography>
      <Box display='flex' justifyContent='space-between' marginY={1}>
        <Typography variant='body2' component='p'>
          Created at: <strong>{getElapsedTime(createdAt)}</strong>
        </Typography>
        {
          updatedAt && (
            <Typography variant='body2' component='p'>
              Last update: <strong>{getElapsedTime(updatedAt)}</strong>
            </Typography>
          )
        }
      </Box>
    </>

  );
};

export default CardHeader;
