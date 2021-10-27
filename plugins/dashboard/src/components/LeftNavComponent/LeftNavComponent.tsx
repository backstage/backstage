import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
/* import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { Content } from '@backstage/core-components'; */
import { Box, List, ListItem} from '@material-ui/core';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
  leftNav: {
    width: '100%',
    background: 'white',
  }
});



export const LeftNavComponent = () => {
  const classes = useStyles();

  return (
      <Box className={classes.leftNav}>
        <List>
          <ListItem>
            Home
          </ListItem>
          <ListItem>
            List
          </ListItem>
          <ListItem>
            Links
          </ListItem>
          <ListItem>
            Product Info
          </ListItem>
        </List>
      </Box>
  );
};

