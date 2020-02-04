import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import PagerDutyServiceStatus from 'shared/components/PagerDutyServiceStatus';
import Link from 'shared/components/Link';
import BreakHints from 'shared/components/BreakHints';
import PrimaryTableLink from 'shared/components/PrimaryTableLink';
import DataGrid from 'shared/components/DataGrid';

class ComponentList extends Component {
  static propTypes = {
    components: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static fragments = {
    list: gql`
      fragment ComponentList on Component {
        id
        system
        pagerDutyService {
          id
          name
          homepageUrl
          activeIncidents {
            id
            title
            status
            homepageUrl
          }
        }
        stateInfo {
          state
          info
        }
      }
    `,
  };

  static fragment = gql`
    fragment UntypedComponents on System {
      untypedComponents {
        ...ComponentList
      }
    }
    ${ComponentList.fragments.list}
  `;

  getColumns = () => {
    return [
      {
        name: 'id',
        width: 200,
        renderer: ({ row }) => <PrimaryTableLink to={`/components/${row.id}`} text={row.id} />,
        alwaysVisible: true,
      },
      {
        name: 'system',
        renderer: ({ row }) => (
          <Link to={`/system/${row.system}`}>
            <BreakHints body={row.system} />
          </Link>
        ),
      },
      {
        name: 'pagerduty',
        width: 150,
        renderer: ({ row }) => <PagerDutyServiceStatus service={row.pagerDutyService} />,
      },
    ];
  };

  render() {
    return <DataGrid columns={this.getColumns()} data={this.props.components} toolbar={false} />;
  }
}

export default ComponentList;
