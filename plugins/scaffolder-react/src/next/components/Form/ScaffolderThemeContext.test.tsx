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
import { renderHook } from '@testing-library/react';
import {
  useScaffolderTheme,
  ScaffolderThemeProvider,
} from './ScaffolderThemeContext';

describe('ScaffolderThemeContext', () => {
  it('should return mui by default when no provider is present', () => {
    const { result } = renderHook(() => useScaffolderTheme());
    expect(result.current).toBe('mui');
  });

  it('should return bui when wrapped in ScaffolderThemeProvider with bui', () => {
    const { result } = renderHook(() => useScaffolderTheme(), {
      wrapper: ({ children }) => (
        <ScaffolderThemeProvider value="bui">
          {children}
        </ScaffolderThemeProvider>
      ),
    });
    expect(result.current).toBe('bui');
  });
});
