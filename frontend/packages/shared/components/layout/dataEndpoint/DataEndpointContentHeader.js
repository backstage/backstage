import React, { Component } from 'react';
import { ContentHeader, Documentation, SupportButton } from 'shared/components/layout';
import Link from 'shared/components/Link';
import Button from '@material-ui/core/Button/Button';
import { Typography } from '@material-ui/core';

class DataEndpointContentHeader extends Component {
  render() {
    return (
      <ContentHeader title="Data Endpoints">
        <Link to="/create-component">
          <Button variant="contained" color="primary">
            Create new data endpoints component
          </Button>
        </Link>
        <Link to="/data-endpoints-editor/create">
          <Button variant="contained" color="primary">
            Create new data endpoint (α)
          </Button>
        </Link>
        <SupportButton slackChannel="#data-support">
          <Typography>All data endpoints that you and your squad(s) own</Typography>
          <Documentation>
            <Link to="https://confluence.spotify.net/display/DI/Data+Infrastructure">Data Infra Overview</Link>
            <Link to="https://developer.spotify.net/products/data-endpoints.html">Data Endpoints</Link>
            <Link to="https://confluence.spotify.net/display/DI/Batch+Management">Batch Management Documentation</Link>
          </Documentation>
        </SupportButton>
      </ContentHeader>
    );
  }
}

export default DataEndpointContentHeader;
