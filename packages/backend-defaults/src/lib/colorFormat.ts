/*
 * Copyright 2024 The Backstage Authors
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

import { Format, TransformableInfo } from 'logform';
import { format } from 'winston';

/**
 * Creates a pretty printed winston log format.
 */
export function colorFormat(): Format {
  const colorizer = format.colorize();

  return format.combine(
    format.timestamp(),
    format.colorize({
      colors: {
        timestamp: 'dim',
        prefix: 'blue',
        field: 'cyan',
        debug: 'grey',
      },
    }),
    format.printf((info: TransformableInfo) => {
      const { timestamp, level, message, plugin, service, ...fields } = info;
      const prefix = plugin || service;
      const timestampColor = colorizer.colorize('timestamp', timestamp);
      const prefixColor = colorizer.colorize('prefix', prefix);

      const extraFields = Object.entries(fields)
        .map(([key, value]) => {
          let stringValue = '';
          try {
            stringValue = `${value}`;
          } catch (e) {
            stringValue = '[field value not castable to string]';
          }
          return `${colorizer.colorize('field', `${key}`)}=${stringValue}`;
        })
        .join(' ');

      return `${timestampColor} ${prefixColor} ${level} ${message} ${extraFields}`;
    }),
  );
}
