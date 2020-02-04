import React, { Component, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import { CardContent, CardHeader, Popover } from '@material-ui/core';
import { InfoIcon } from 'shared/icons';
import gql from 'graphql-tag';
import { MetadataList, MetadataListItem, MetadataTable, MetadataTableItem } from 'shared/components/MetadataTable';
import Link from 'shared/components/Link';
import { GA_DEFAULT_USERNAME_PROPS } from 'shared/apis/events/GoogleAnalyticsEvent';

const UserDetails = ({ user, onClose }) => (
  <Fragment>
    <CardHeader title={user.fullName} />
    <CardContent>
      <MetadataTable dense>
        <MetadataTableItem title="Username">
          <Link
            to={`https://start.spotify.net/people/display/${encodeURIComponent(user.username)}`}
            onClick={onClose}
            gaprops={GA_DEFAULT_USERNAME_PROPS}
          >
            {user.username}
          </Link>
        </MetadataTableItem>
        <MetadataTableItem title="E-mail">
          <Link to={`mailto:${user.email}`} onClick={onClose}>
            {user.email}
          </Link>
        </MetadataTableItem>
        <MetadataTableItem title="Slack">
          <Link slackUser={user.username} onClick={onClose} gaprops={GA_DEFAULT_USERNAME_PROPS} />
        </MetadataTableItem>
        {!(user.squads && user.squads.length) ? null : (
          <MetadataTableItem title="Squads">
            <MetadataList>
              {user.squads.map(squad => (
                <MetadataListItem key={squad.name}>
                  <Link to={`/org/${encodeURIComponent(squad.name)}`}>{squad.name}</Link>
                </MetadataListItem>
              ))}
            </MetadataList>
          </MetadataTableItem>
        )}
      </MetadataTable>
    </CardContent>
  </Fragment>
);

class User extends Component {
  static fragment = gql`
    fragment User on User {
      username
      fullName
      email
      squads {
        id
        name
      }
    }
  `;

  state = {
    dropdownAnchorElement: null,
  };

  onOpenDropdown = event => {
    this.setState({
      dropdownAnchorElement: findDOMNode(this.anchor),
    });
    event.preventDefault();
    event.target.blur();
  };

  onCloseDropdown = () => {
    this.setState({
      dropdownAnchorElement: null,
    });
  };

  render() {
    const { user } = this.props;
    const { dropdownAnchorElement } = this.state;
    return (
      <Fragment>
        {dropdownAnchorElement && (
          <Popover
            open={true}
            anchorEl={dropdownAnchorElement}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            onClose={this.onCloseDropdown}
            BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.2)' } }}
          >
            <UserDetails user={user} onClose={this.onCloseDropdown} />
          </Popover>
        )}
        <Link onClick={this.onOpenDropdown} ref={el => (this.anchor = el)} gaprops={GA_DEFAULT_USERNAME_PROPS}>
          {user.fullName} <InfoIcon style={{ position: 'relative', top: 2, fontSize: 13 }} />
        </Link>
      </Fragment>
    );
  }
}

export default User;
