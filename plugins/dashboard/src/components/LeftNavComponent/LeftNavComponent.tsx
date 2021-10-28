import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
/* import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { Content } from '@backstage/core-components'; */
import { Box, List, ListItem, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
  leftNav: {
    width: '100%',
    background: 'white',
  },
  selected: {
    borderLeft: '6px solid #112e51',
  },
  unselected: {
    borderLeft: '6px solid white',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#f8f8f8',
      borderLeft: '6px solid #f8f8f8',
    },
  },
});

export const LeftNavComponent = (tableProp: any) => {
  const classes = useStyles();
  const { table, setTable } = tableProp.tableProp;

  const resetPageLocation = (arg: string) => {
    setTable(arg);
  };

  return (
    <Box className={classes.leftNav}>
      <List style={{ padding: '0px' }}>
        <ListItem
          className={table === 'home' ? classes.selected : classes.unselected}
          onClick={() => resetPageLocation('home')}
        >
          <Typography>Home</Typography>
        </ListItem>
        <ListItem
          className={table === 'links' ? classes.selected : classes.unselected}
          onClick={() => resetPageLocation('links')}
        >
          <Typography>Links</Typography>
        </ListItem>
        <ListItem
          className={
            table === 'contact' ? classes.selected : classes.unselected
          }
          onClick={() => resetPageLocation('contact')}
        >
          <Typography>Contact</Typography>
        </ListItem>
        <ListItem
          className={table === 'health' ? classes.selected : classes.unselected}
          onClick={() => resetPageLocation('health')}
        >
          <Typography>Health</Typography>
        </ListItem>
        <ListItem
          className={
            table === 'metrics' ? classes.selected : classes.unselected
          }
          onClick={() => resetPageLocation('metrics')}
        >
          <Typography>Metrics</Typography>
        </ListItem>
        <ListItem
          className={table === 'cicd' ? classes.selected : classes.unselected}
          onClick={() => resetPageLocation('cicd')}
        >
          <Typography>CI/CD</Typography>
        </ListItem>
        <ListItem
          className={
            table === 'testing' ? classes.selected : classes.unselected
          }
          onClick={() => resetPageLocation('testing')}
        >
          <Typography>Testing</Typography>
        </ListItem>
        <ListItem
          className={
            table === 'security' ? classes.selected : classes.unselected
          }
          onClick={() => resetPageLocation('security')}
        >
          <Typography>Security</Typography>
        </ListItem>
        <ListItem
          className={
            table === 'chargeback' ? classes.selected : classes.unselected
          }
          onClick={() => resetPageLocation('chargeback')}
        >
          <Typography>Charge Back</Typography>
        </ListItem>
      </List>
    </Box>
  );
};
