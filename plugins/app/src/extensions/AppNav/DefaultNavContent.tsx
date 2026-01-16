/*
 * Copyright 2023 The Backstage Authors
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

import {
  Sidebar,
  SidebarDivider,
  SidebarItem,
} from '@backstage/core-components';
import { NavContentComponentProps } from '@backstage/frontend-plugin-api';

export function DefaultNavContent({
  items,
  Logo,
  Search,
}: NavContentComponentProps) {
  return (
    <Sidebar>
      {Logo && <Logo />}
      {Search && <Search />}
      {(() => {
        // Separate items with and without positions

        const length = items.length;
        const itemsWithPosition = [
          ...items.filter(i => typeof i.position === 'number'),
        ];
        const itemsWithoutPosition = [
          ...items.filter(i => typeof i.position !== 'number'),
        ];
        const sortedItems = [];

        for (let i = 0; i < length; i++) {
          const itemAtPosition = itemsWithPosition.filter(
            item => item.position === i,
          );
          if (itemAtPosition.length) {
            // If there are multiple items at the same position, maintain their original order
            sortedItems.push(...itemAtPosition);
          } else if (itemsWithoutPosition.length) {
            // Fill gaps with unpositioned items in their original order
            sortedItems.push(itemsWithoutPosition.shift()!);
          }
        }

        return sortedItems.map((item, displayIndex) => {
          const CustomComponent = item.CustomComponent;
          if (item.hide) {
            return null;
          }

          if ('CustomComponent' in item && CustomComponent) {
            return (
              <>
                <CustomComponent key={displayIndex} />
                {item.dividerBelow && <SidebarDivider />}
              </>
            );
          }

          return (
            <>
              <SidebarItem {...item} to={item.to!} key={displayIndex} />{' '}
              {item.dividerBelow && <SidebarDivider />}
            </>
          );
        });
      })()}
    </Sidebar>
  );
}
