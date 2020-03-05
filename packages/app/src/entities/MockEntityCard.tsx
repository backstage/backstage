import React, { FC } from 'react';
import { useEntityUri } from '@spotify-backstage/core';

const MockEntityPage: FC<{}> = () => {
  const uri = useEntityUri();
  return <span>Mock card for {uri}, replace with some userful plugin</span>;
};

export default MockEntityPage;
