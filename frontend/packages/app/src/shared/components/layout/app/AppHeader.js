import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Header } from 'shared/components/layout';
import { HeaderLabel, OwnerHeaderLabel } from 'shared/components/layout';
import ComponentContextMenu from 'shared/apis/sysmodel/components/ComponentContextMenu';

class AppHeader extends Component {
  static fragment = gql`
    fragment AppHeader on Component {
      id
      owner {
        id
        name
        type
      }
      componentType
      componentInfoLocationUri
      lifecycle
    }
  `;

  render() {
    const { app } = this.props;
    return (
      <Header type="App" title={app.id}>
        <OwnerHeaderLabel owner={app.owner} />
        <HeaderLabel label="Lifecycle" value={app.lifecycle} />
        <ComponentContextMenu
          componentId={app.id}
          componentLocation={app.componentInfoLocationUri}
          componentType={app.componentType}
        />
      </Header>
    );
  }
}

export default AppHeader;
