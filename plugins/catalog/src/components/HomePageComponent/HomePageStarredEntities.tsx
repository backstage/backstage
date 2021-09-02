/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import {
  entityRouteRef,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles({
  starredEntityContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  starredEntityStar: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  starredEntityName: {
    fontSize: '1.3rem',
    flex: 1,
  },
});

const StarredEntity = ({ name, url }: { name: string; url: string }) => {
  const classes = useStyles();

  return (
    <div className={classes.starredEntityContainer}>
      <Link to={url} className={classes.starredEntityName}>
        {name}
      </Link>
    </div>
  );
};

export const HomePageStarredEntities = () => {
  const { starredEntities } = useStarredEntities();
  const linkCreator = useRouteRef(entityRouteRef);

  const parseEntityKey = (entityKey: string) => {
    const [_, kind, namespace, ...nameArr] = entityKey.split(':');
    const name = nameArr.join('');

    return { name, url: linkCreator({ kind, namespace, name }) };
  };

  return (
    <>
      {Array.from(starredEntities)
        .map(parseEntityKey)
        .map(entity => (
          <StarredEntity {...entity} />
        ))}
    </>
  );
};
