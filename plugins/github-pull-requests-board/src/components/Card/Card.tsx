import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Box, Paper, CardActionArea } from '@material-ui/core';
import CardHeader from './CardHeader';

type Props = {
  title: string;
  createdAt: string;
  updatedAt?: string;
  prUrl: string;
  authorName: string;
  authorAvatar?: string;
  repositoryName: string;
}

const Card: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
  const {
    title,
    createdAt,
    updatedAt,
    prUrl,
    authorName,
    authorAvatar,
    repositoryName,
    children
  } = props;

  return (
    <Box marginBottom={1}>
      <Paper variant='outlined'>
        <CardActionArea href={prUrl} target='_blank'>
          <Box padding={1}>
            <CardHeader
              title={title}
              createdAt={createdAt}
              updatedAt={updatedAt}
              authorName={authorName}
              authorAvatar={authorAvatar}
              repositoryName={repositoryName}
            />
            { children }
          </Box>
        </CardActionArea>
      </Paper>
    </Box>
  );
};

export default Card;
