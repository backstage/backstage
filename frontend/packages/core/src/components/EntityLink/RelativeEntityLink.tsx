import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useEntity } from '../../api';
import { buildPath } from './EntityLink';

type Props = {
  view: string;
};

const RelativeEntityLink: FC<Props> = ({ view, children }) => {
  const entity = useEntity();

  return <Link to={buildPath(entity.kind, entity.id, view)}>{children}</Link>;
};

export default RelativeEntityLink;
