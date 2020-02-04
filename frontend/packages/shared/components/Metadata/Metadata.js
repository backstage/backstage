import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Snackbar } from '@material-ui/core';
import InfoCard from 'shared/components/InfoCard';
import MetadataCardAction from './MetadataCardAction';
import Link from 'shared/components/Link';
import ReactJoin from 'react-join';

import { metadataValueToElement } from './metadataUtils';
import { MetadataTable, MetadataTableItem } from 'shared/components/MetadataTable';
import { refreshAction } from 'shared/apis/sysmodel/sysmodelActions';
import { normalizeComponent } from 'shared/apis/sysmodel/sysmodelUtils';

class Metadata extends Component {
  static fragment = gql`
    fragment Metadata on Component {
      id
      componentInfoLocationUrl
      system
      roles {
        id
      }
      apps {
        id
      }
      visibility
      pagerDutyKey
      serviceDiscovery
      jiraFeature
      lifecycle
      hasOpenApiDoc
      componentType
      clientId
    }
  `;

  static propTypes = {
    component: PropTypes.object.isRequired,
  };

  static EXCLUDED_KEYS = [
    'owner',
    'maintainers',
    'slackChannel',
    'description',
    '__typename',
    'role',
    'componentInfoLocationUri',
    'componentInfoLocationUrl',
    'serviceInfoLocation',
    'gheRepoUrl',
    'docs',
    'techDocs',
    'outgoingDependencies',
    'incomingDependencies',
    'codeCoverage',
    'apps',
    'roles',
    'testing',
    'appFeatures',
    'workflows',
    'dataEndpoints',
    'system',
    'stateInfo',
    'repo',
    'hasOpenApiDoc',
    'factsJson',
    'tc4xCertification',
    'relatedComponents',
  ];

  state = {
    snackbarOpen: false,
    snackbarMessage: null,
  };

  get component() {
    return normalizeComponent(this.props.component);
  }

  refresh = () => {
    refreshAction(this.props.component.id)
      .then(data => {
        this.setState({
          snackbarOpen: true,
          snackbarMessage:
            data.state_info.state.toLowerCase() !== 'all_ok'
              ? `Error: ${data.state_info.state} ${data.state_info.info}`
              : 'Refresh completed. Changes take a few minutes to propagate.',
        });
      })
      .catch(() => {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: 'Failed to refresh, please report to #backstage',
        });
      });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackbarOpen: false,
      snackbarMessage: null,
    });
  };

  render() {
    if (!this.props.component) {
      return null;
    }
    const component = this.component;

    const keys = Object.keys(component).filter(key => !Metadata.EXCLUDED_KEYS.includes(key));

    let cardButtons = null;
    if (component.serviceInfoLocation) {
      const editURL = component.serviceInfoLocation.replace('/blob/', '/edit/');
      cardButtons = (
        <MetadataCardAction
          refresh={this.refresh}
          cardActions={[
            {
              title: 'Edit Metadata',
              link: editURL,
            },
          ]}
        />
      );
    }

    return (
      <InfoCard title="Metadata" actions={cardButtons}>
        <MetadataTable>
          <MetadataTableItem title="system">
            <Link to={`/system/${component.system}`}>{component.system}</Link>
          </MetadataTableItem>
          {keys.map(key => (
            <MetadataTableItem key={key} title={key}>
              {metadataValueToElement(component[key])}
            </MetadataTableItem>
          ))}
          {component.relatedComponents && component.relatedComponents.length > 0 ? (
            <MetadataTableItem title="Related components">
              <ReactJoin>
                {component.relatedComponents.map(component => (
                  <Link key={component.id} to={`/components/${component.id}`}>
                    {component.id}
                  </Link>
                ))}
              </ReactJoin>
            </MetadataTableItem>
          ) : null}
          {component.apps && component.apps.length > 0 ? (
            <MetadataTableItem title="apps">
              {component.apps.map(app => (
                <Link key={app.id} to={`/apps/${app.id}`}>
                  {app.id}
                </Link>
              ))}
            </MetadataTableItem>
          ) : null}
          {component.roles ? (
            <MetadataTableItem title="roles">{component.roles.map(role => role.id).join(', ')}</MetadataTableItem>
          ) : null}
        </MetadataTable>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={this.state.snackbarMessage}
          key={this.state.snackbarMessage}
        />
      </InfoCard>
    );
  }
}

export default Metadata;
