import React from 'react';
import {
  Typography,
  Box,
  Avatar,
  makeStyles
} from '@material-ui/core';

type Props = {
  name: string;
  avatar?: string;
}

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(1)
  }
}));

const UserHeader = (props: Props) => {
  const { name, avatar } = props;
  const classes = useStyles();

  return (
    <Box display='flex' alignItems='center' marginX={1}>
      <Typography color='textSecondary' variant='body2' component='p'>
        {name}
      </Typography>
      <Avatar alt={name} src={avatar} className={classes.small} />
    </Box>
  );
};

export default UserHeader;
