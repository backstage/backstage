import React from 'react';
/* import { Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use'; */
import { Table, TableColumn } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
/* import { getEntitySourceLocation } from '@backstage/catalog-model';
import { Link, Tab } from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch'; */
const useStyles = makeStyles({
  gridParent: {
    height: '100%',
  },
  heading: {
    marginTop: '0px',
  },
  linkParent: {
    width: '100%',
    textAlign: 'center',
  },
  link: {
    color: '#112e51',
    textDecoration: 'underline',
  },
});

export const DashboardTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'ProductInfo',
      field: 'prodInfo',
    },
    {
      title: 'CICD',
      field: 'cicd',
    },
    {
      title: 'Security',
      field: 'security',
    },
    {
      title: 'Other',
      field: 'other',
    },
  ];
  const testData = [
    {
      prodInfo: (
        <Grid>
          <h3 className={classes.heading}>Important Links</h3>
          <Grid className={classes.linkParent}>
            <a href="#" className={classes.link}>
              https://Link1.com
            </a>
          </Grid>
        </Grid>
      ),
      cicd: null,
      security: null,
      other: (
        <Grid>
          <Typography>3 of 4 pods on</Typography>
        </Grid>
      ),
    },
    {
      prodInfo: (
        <Grid>
          <h3 className={classes.heading}>Product Contact List</h3>
          <Grid className={classes.linkParent}>
            <Typography>James Madison: JamesM@president.com</Typography>
          </Grid>
        </Grid>
      ),
      cicd: 'cicdTest',
    },
    {
      security: 'securitytest',
    },
    {
      other: 'othertest',
    },
  ];

  return (
    <Table
      title="Current Status"
      columns={columns}
      data={testData}
      options={{ paging: false }}
    />
  );
};
