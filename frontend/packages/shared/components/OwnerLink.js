import React from 'react';
import Link from 'shared/components/Link';
import { SquadIcon, UserIcon } from 'shared/icons';
import { GA_DEFAULT_OWNER_PROPS } from 'shared/apis/events/GoogleAnalyticsEvent';
import { paths } from 'plugins/whoami/definitions/config';
import InlineIcon from 'shared/components/InlineIcon';

// GraphQL returns an 'unknown' type for users (fallback) but not for any groups
const ownerLinkBase = {
  squad: `${paths.GROUPS_URL}/`,
  unknown: `${paths.USERS_URL}/`,
  user: `${paths.USERS_URL}/`,
};

const ownerIcon = {
  squad: SquadIcon,
  unknown: UserIcon,
  user: UserIcon,
};

export function buildOwnerLink(owner) {
  if (!owner) {
    return null;
  }

  const path = ownerLinkBase[owner.type] || ownerLinkBase['squad'];
  return `${path}${encodeURIComponent(owner.name)}`;
}

const OwnerLink = ({ owner }) => {
  if (!owner) {
    return null;
  }

  const IconComponent = ownerIcon[owner.type] || ownerIcon['squad'];

  return (
    <Link to={buildOwnerLink(owner)} gaprops={GA_DEFAULT_OWNER_PROPS}>
      <InlineIcon icon={IconComponent} />
      {owner.name || ''}
    </Link>
  );
};

export default OwnerLink;
