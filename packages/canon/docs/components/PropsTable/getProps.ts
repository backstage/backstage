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
export function getProps(styles: Record<string, any>) {
  return Object.keys(styles).reduce(
    (acc: Record<string, { type: any[]; responsive: boolean }>, n) => {
      const style = styles[n];

      let values: string[] = [];

      if (style.values) {
        // If values exist, use them
        values = Object.keys(style.values);
      } else if (style.mappings && style.mappings.length > 0) {
        // If mappings exist, use the first mapping's values
        const firstMapping = style.mappings[0];
        values = Object.keys(styles[firstMapping].values);
      } else {
        // Default to an empty array if neither values nor mappings exist
        values = [];
      }

      acc[n] = {
        type: values,
        responsive: true,
      };
      return acc;
    },
    {} as Record<string, { type: string[]; responsive: boolean }>,
  );
}
