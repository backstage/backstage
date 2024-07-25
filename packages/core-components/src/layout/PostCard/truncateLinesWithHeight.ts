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
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export function truncateLinesWithHeight(
  lines: number,
  lineHeight: CSSProperties['lineHeight'],
  fontSize?: CSSProperties['fontSize'],
): CSSProperties {
  const properties: CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': lines,
    '-webkit-box-orient': 'vertical',
  };

  properties.margin = 0;
  properties.lineHeight = lineHeight;

  if (fontSize) {
    properties.height = `calc((${fontSize} * ${lineHeight}) * ${lines})`;
    properties.fontSize = fontSize;
  } else {
    properties.height = `calc(${lineHeight} * ${lines})`;
  }

  return properties;
}
