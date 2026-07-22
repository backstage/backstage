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
import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';

import {
  GoldenPathTaskContextProvider,
  useGoldenPathTaskContext,
} from './useGoldenPathTaskContext';
import { GP_TASK } from '../../mocks';

jest.mock('../../hooks/useGoldenPathStatuses', () => ({
  useGoldenPathStatuses: () => [{}],
}));

describe('useGoldenPathTaskContext', () => {
  it('should throw if used outside of context provider', () => {
    expect(() => renderHook(() => useGoldenPathTaskContext())).toThrow(
      'Golden Path Task context is not available',
    );
  });

  it('should return context value', () => {
    const { result } = renderHook(() => useGoldenPathTaskContext(), {
      wrapper: ({ children }: PropsWithChildren) => (
        <GoldenPathTaskContextProvider
          task={GP_TASK}
          children={children}
          getGoldenPathTask={() => Promise.resolve(GP_TASK)}
        />
      ),
    });

    expect(result.current.value.goldenPathTask).toEqual(GP_TASK);
    expect(result.current.value.templateStepId).toEqual('');
  });
});
