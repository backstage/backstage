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
import { renderHook, waitFor } from '@testing-library/react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useDescription } from './DetailsDescription.utils';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(),
}));

describe('useDescription', () => {
  const mockEntity = {
    metadata: {
      description: 'Test description',
    },
  };

  beforeEach(() => {
    (useEntity as jest.Mock).mockReturnValue({ entity: mockEntity });
  });

  it('should return description, open, toggleOpen, showButton, and refElement', () => {
    const { result } = renderHook(() => useDescription());
    expect(result.current).toMatchObject({
      description: 'Test description',
      open: false,
      toggleOpen: expect.any(Function),
      showButton: false,
      refElement: { current: null },
    });
  });

  it('should toggle open state', async () => {
    const { result } = renderHook(() => useDescription());

    await waitFor(() => {
      result.current.toggleOpen();

      expect(result.current.open).toBe(true);
    });
    await waitFor(() => {
      result.current.toggleOpen();

      expect(result.current.open).toBe(false);
    });
  });

  it('should show or hide button based on refElement dimensions', async () => {
    const { result } = renderHook(() => useDescription());
    const refElement = {
      clientHeight: 100,
      scrollHeight: 200,
    };
    result.current.refElement.current = refElement as HTMLDivElement;

    await waitFor(() => {
      window.dispatchEvent(new Event('resize'));

      expect(result.current.showButton).toBe(true);
    });

    await waitFor(() => {
      result.current.toggleOpen();
      refElement.clientHeight = 200;
      refElement.scrollHeight = 200;
      window.dispatchEvent(new Event('resize'));

      expect(result.current.showButton).toBe(false);
    });
  });

  it('should add and remove resize event listener', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useDescription());
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });
});
