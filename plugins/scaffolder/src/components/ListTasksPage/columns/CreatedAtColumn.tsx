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
import { DateTime } from 'luxon';
import { FC } from 'react';
import Typography from '@material-ui/core/Typography';

interface CreatedAtColumnProps {
  createdAt: string;
  locale?: string;
}

export const CreatedAtColumn: FC<CreatedAtColumnProps> = ({
  createdAt,
  locale,
}) => {
  const createdAtTime = DateTime.fromISO(createdAt);

  const userLocale = locale || window.navigator.language || 'en-US';

  const formatted = createdAtTime.setLocale(userLocale).toLocaleString({
    ...DateTime.DATETIME_SHORT_WITH_SECONDS,
  });

  return <Typography paragraph>{formatted}</Typography>;
};
