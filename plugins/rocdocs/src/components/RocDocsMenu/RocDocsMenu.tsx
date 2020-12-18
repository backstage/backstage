/*
 * Copyright 2020 Spotify AB
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
import { Link, makeStyles } from '@material-ui/core';
import { generatePath, Link as RouterLink, useParams } from 'react-router-dom';

const useListStyles = makeStyles({
  unorderedList: {
    listStyleType: 'none',
    padding: '0',
    '& ul': {
      padding: '0 0 0 20px',
    },
  },
  listItem: {
    padding: '5px 0 0 0',
  },
});

type RocDocsMenuItemProps = {
  menuItem: RocDocsMenuItem;
};

const RocDocsMenuItem = ({ menuItem }: RocDocsMenuItemProps) => {
  const { namespace, kind, name } = useParams();
  const listStyles = useListStyles();

  return (
    <li className={listStyles.listItem}>
      {menuItem.link ? (
        <Link
          component={RouterLink}
          to={`/rocdocs/${generatePath('/:namespace/:kind/:name/*', {
            namespace: namespace,
            kind: kind,
            name: name,
            '*': menuItem.link as string,
          })}`}
        >
          {menuItem.name}
        </Link>
      ) : (
        menuItem.name
      )}

      {menuItem.items ? <RocDocsMenu menuData={menuItem.items} /> : null}
    </li>
  );
};

type RocDocsMenuItem = {
  name: string;
  link: string;
  items?: RocDocsMenuItem[];
};

type RocDocsMenuProps = {
  menuData: RocDocsMenuItem[];
};

export const RocDocsMenu = ({ menuData }: RocDocsMenuProps) => {
  const listStyles = useListStyles();

  return (
    <ul className={listStyles.unorderedList}>
      {menuData.map(menuItem => {
        return <RocDocsMenuItem menuItem={menuItem} />;
      })}
    </ul>
  );
};
