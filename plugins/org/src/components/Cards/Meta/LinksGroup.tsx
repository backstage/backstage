/*
 * Copyright 2022 The Backstage Authors
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
import { EntityLink } from '@backstage/catalog-model';
import { IconComponent, useApp } from '@backstage/core-plugin-api';
import LanguageIcon from '@material-ui/icons/Language';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import React from 'react';

const WebLink = ({
  href,
  Icon,
  text,
}: {
  href: string;
  text?: string;
  Icon?: IconComponent;
}) => (
  <ListItem button component="a" key={href} href={href}>
    <ListItemIcon>{Icon ? <Icon /> : <LanguageIcon />}</ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </ListItem>
);

export const LinksGroup = ({ links }: { links?: EntityLink[] }) => {
  const app = useApp();
  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;

  if (links === undefined) {
    return null;
  }

  return (
    <>
      <Divider />
      {links.map(link => {
        return (
          <WebLink
            key={link.url}
            href={link.url}
            text={link.title}
            Icon={iconResolver(link.icon)}
          />
        );
      })}
    </>
  );
};
