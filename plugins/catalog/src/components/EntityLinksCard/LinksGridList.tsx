/*
 * Copyright 2020 The Backstage Authors
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

import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import React from 'react';
import { IconLink } from './IconLink';
import { ColumnBreakpoints } from './types';
import { useDynamicColumns } from './useDynamicColumns';
import { IconComponent } from '@backstage/core-plugin-api';

export interface LinksGridListItem {
  href: string;
  text?: string;
  Icon?: IconComponent;
}

interface LinksGridListProps {
  items: LinksGridListItem[];
  cols?: ColumnBreakpoints | number;
}

export function LinksGridList(props: LinksGridListProps) {
  const { items, cols = undefined } = props;
  const numOfCols = useDynamicColumns(cols);

  return (
    <ImageList rowHeight="auto" cols={numOfCols}>
      {items.map(({ text, href, Icon }, i) => (
        <ImageListItem key={i}>
          <IconLink href={href} text={text ?? href} Icon={Icon} />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
