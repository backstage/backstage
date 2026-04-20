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
import { Text, Button } from '@backstage/ui';
import { useState } from 'react';

const MAX_LENGTH = 100;

export const NotificationDescription = (props: { description: string }) => {
  const { description } = props;
  const [shown, setShown] = useState(false);
  const isLong = description.length > MAX_LENGTH;

  if (!isLong) {
    return <Text variant="body-small">{description}</Text>;
  }

  if (shown) {
    return (
      <Text variant="body-small">
        {description}{' '}
        <Button
          variant="tertiary"
          onPress={() => {
            setShown(false);
          }}
        >
          Show less
        </Button>
      </Text>
    );
  }
  return (
    <Text variant="body-small">
      {description.substring(0, MAX_LENGTH)}...{' '}
      <Button
        variant="tertiary"
        onPress={() => {
          setShown(true);
        }}
      >
        Show more
      </Button>
    </Text>
  );
};
