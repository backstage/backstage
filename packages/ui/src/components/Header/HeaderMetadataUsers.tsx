/*
 * Copyright 2026 The Backstage Authors
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

import type { HeaderMetadataUser } from './types';
import { Avatar } from '../Avatar';
import { Tooltip, TooltipTrigger } from '../Tooltip';
import { Text } from '../Text';
import { Link } from '../Link';
import { Pressable } from 'react-aria';
import styles from './HeaderMetadataUsers.module.css';

/**
 * Displays a list of users as avatars inside a Header metadata value.
 * A single user shows the avatar with their name beside it.
 * Multiple users show avatars in a row with the name revealed on hover via tooltip.
 * When a user has an `href`, the avatar and name become links.
 *
 * @public
 */
export const HeaderMetadataUsers = ({
  users,
}: {
  users: HeaderMetadataUser[];
}) => {
  if (users.length === 0) return null;

  if (users.length === 1) {
    const user = users[0];
    if (user.href) {
      return (
        <Link
          href={user.href}
          variant="body-medium"
          standalone
          className={styles.single}
        >
          <Avatar
            src={user.src ?? 'data:,'}
            name={user.name}
            size="small"
            purpose="decoration"
          />
          {user.name}
        </Link>
      );
    }

    return (
      <div className={styles.single}>
        <Avatar
          src={user.src ?? 'data:,'}
          name={user.name}
          size="small"
          purpose="decoration"
        />
        <Text variant="body-medium">{user.name}</Text>
      </div>
    );
  }

  return (
    <ul className={styles.stack}>
      {users.map((user, i) => (
        <li key={user.href ?? `${i}:${user.name}`}>
          <TooltipTrigger>
            {user.href ? (
              <Link
                href={user.href}
                aria-label={user.name}
                className={styles.avatarLink}
              >
                <Avatar
                  src={user.src ?? 'data:,'}
                  name={user.name}
                  size="small"
                  purpose="decoration"
                />
              </Link>
            ) : (
              <Pressable>
                <Avatar
                  src={user.src ?? 'data:,'}
                  name={user.name}
                  size="small"
                  purpose="informative"
                />
              </Pressable>
            )}
            <Tooltip>{user.name}</Tooltip>
          </TooltipTrigger>
        </li>
      ))}
    </ul>
  );
};
