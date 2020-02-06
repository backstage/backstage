import React, { FC } from 'react';
import { Header, useEntity, useEntityConfig } from '../..';
import { EntityPageHeaderProps } from '../../api/entityView/types';

const DefaultEntityPageHeader: FC<EntityPageHeaderProps> = () => {
  const { id } = useEntity();
  const config = useEntityConfig();
  return <Header title={`${config.title} - ${id}`} />;
};

export default DefaultEntityPageHeader;
