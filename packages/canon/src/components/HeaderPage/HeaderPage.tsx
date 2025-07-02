/*
 * Copyright 2025 The Backstage Authors
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

import type { HeaderPageProps } from './types';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { Flex } from '../Flex';
import { Menu } from '../Menu';
import { ButtonIcon } from '../ButtonIcon';
import { RiMore2Line } from '@remixicon/react';

/**
 * A component that renders a header page.
 *
 * @public
 */
export const HeaderPage = (props: HeaderPageProps) => {
  const { name, description, options } = props;

  return (
    <Flex pl="4" pr="2" mt="6" justify="between">
      <Flex direction="column" gap="2">
        <Heading variant="title4">{name}</Heading>
        <Text>{description}</Text>
      </Flex>
      <div>
        {options && (
          <Menu.Root>
            <Menu.Trigger
              render={props => (
                <ButtonIcon
                  {...props}
                  size="small"
                  icon={<RiMore2Line />}
                  variant="secondary"
                />
              )}
            />
            <Menu.Portal>
              <Menu.Positioner sideOffset={4} align="end">
                <Menu.Popup>
                  {options.map(option => (
                    <Menu.Item
                      key={option.value}
                      onClick={() => option.onClick?.()}
                    >
                      {option.label}
                    </Menu.Item>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        )}
      </div>
    </Flex>
  );
};
