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

import React, { useState } from 'react';
import { generatePath, Link as RouterLink, useParams } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { makeStyles, createStyles, Theme } from '@material-ui/core';

type RocDocsMenuItemProps = {
  menuItem: RocDocsMenuItem;
};

const RocDocsMenuItem = ({ menuItem }: RocDocsMenuItemProps) => {
  return <></>;
};

type RocDocsMenuItem = {
  name: string;
  link: string;
  items?: RocDocsMenuItem[];
};

type RocDocsMenuProps = {
  menuData: RocDocsMenuItem[];
  listClasses?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
);

export const RocDocsMenu = ({ menuData, listClasses }: RocDocsMenuProps) => {
  const { namespace, kind, name } = useParams();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const styles = useStyles();

  const expander = (isOpen: boolean) => {
    return isOpen ? <ExpandLess /> : <ExpandMore />;
  };

  return (
    <List component="nav">
      {menuData.map(menuItem => {
        const isOpen =
          open[menuItem.link] !== undefined ? open[menuItem.link] : true;

        return (
          <div key={`${menuItem.link}`}>
            <>
              <ListItem
                className={listClasses}
                button
                component={menuItem.link ? RouterLink : 'div'}
                onClick={() => {
                  if (menuItem.items) {
                    setOpen({ [menuItem.link]: !isOpen });
                  }
                }}
                to={
                  menuItem.link
                    ? `/rocdocs/${generatePath('/:namespace/:kind/:name/*', {
                        namespace: namespace,
                        kind: kind,
                        name: name,
                        '*': menuItem.link as string,
                      })}`
                    : undefined
                }
              >
                <ListItemText primary={menuItem.name} />
                {menuItem.items ? expander(isOpen) : null}
              </ListItem>

              {menuItem.items ? (
                <>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <RocDocsMenu
                      listClasses={styles.nested}
                      menuData={menuItem.items}
                    />
                  </Collapse>
                </>
              ) : null}
            </>
          </div>
        );
      })}
    </List>
  );
};
