import React from 'react';
import {
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  Typography,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';

type Props = {
  result: any;
};
// Had to place it here because otherwise plugins are out of src directory. and it was giving error.
export const GitHubIssueListItem = ({ result }: Props) => {
  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={result.image} />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
              >
                <b>@{result.user}</b>
              </Typography>
              <pre>{result.text}</pre>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider />
    </Link>
  );
};
