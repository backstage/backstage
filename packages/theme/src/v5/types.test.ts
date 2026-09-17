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

import { palettes } from '../base';
import { createUnifiedTheme } from '../unified';

declare module '@backstage/theme' {
  interface OverrideComponentNameToClassKeys {
    MyTestComponent: 'root' | 'header';
  }
}

describe('OverrideComponentNameToClassKeys', () => {
  it('should provide type safe component style overrides', () => {
    const theme = createUnifiedTheme({
      palette: palettes.light,
      components: {
        MyTestComponent: {
          styleOverrides: {
            root: {
              color: '#f00',
            },
            // @ts-expect-error
            invalid: {
              color: '#b45',
            },
          },
        },
      },
    });

    expect(theme).toBeDefined();
  });
});
