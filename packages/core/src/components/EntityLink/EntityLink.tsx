import React, { FC } from 'react';
import { Link, LinkProps } from 'react-router-dom';

type Props = Omit<LinkProps, 'to'> & {
  subPath?: string;
} & (
    | {
        kind: string;
        id?: string;
      }
    | {
        uri: string;
      }
  );

export function buildPath(kind: string, id?: string, subPath?: string) {
  if (id) {
    if (subPath) {
      return `/entity/${kind}/${id}/${subPath.replace(/^\//, '')}`;
    }
    return `/entity/${kind}/${id}`;
  }
  return `/entity/${kind}`;
}

const EntityLink: FC<Props> = ({ subPath, children, ...props }) => {
  if ('kind' in props) {
    const { kind, id } = props;
    return (
      <Link to={buildPath(kind, id, subPath)} {...props}>
        {children}
      </Link>
    );
  } else {
    const match = props.uri.match(/entity:([^:]+)(:[^:]+)?/);
    if (!match) {
      throw new TypeError(`Invalid entity uri: '${props.uri}'`);
    }

    const [, kind, maybeId] = match;
    const id = maybeId ? maybeId.slice(1) : undefined;

    return (
      <Link to={buildPath(kind, id, subPath)} {...props}>
        {children}
      </Link>
    );
  }
};

export default EntityLink;
