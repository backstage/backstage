import React, { FC } from 'react';
import { Header, useEntity, useEntityConfig, pageTheme } from '../..';
import { EntityPageHeaderProps } from '../../api/entityView/types';
import { Theme } from '../../layout/Page/Page';

const DefaultEntityPageHeader: FC<EntityPageHeaderProps> = () => {
  const { id } = useEntity();
  const config = useEntityConfig();

  // TODO(rugvip): provide theme through entity config
  return (
    <Theme.Provider value={pageTheme.service}>
      <Header title={`${config.title} - ${id}`} />
    </Theme.Provider>
  );
};

export default DefaultEntityPageHeader;
