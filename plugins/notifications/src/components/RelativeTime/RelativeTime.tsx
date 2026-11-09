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
import { DateTime } from 'luxon';

/**
 * Renders a timestamp as relative text, such as "5 minutes ago", in a `<time>`
 * element whose `dateTime` and `title` hold the exact UTC time.
 */
export const RelativeTime = (props: {
  value: Date | string;
  className?: string;
}) => {
  const { value, className } = props;
  const date =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(value);
  if (!date.isValid) {
    return null;
  }

  const iso = date.toUTC().toISO()!;
  return (
    <time dateTime={iso} title={iso} className={className}>
      {date.toRelative()}
    </time>
  );
};
