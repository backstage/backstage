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
import { act, renderHook } from '@testing-library/react';
import { usePackageWorkspaceState } from './usePackageWorkspaceState';

const mockPush = jest.fn();
const mockUseLocation = jest.fn();

jest.mock(
  '@docusaurus/router',
  () => ({
    useHistory: () => ({ push: mockPush }),
    useLocation: () => mockUseLocation(),
  }),
  { virtual: true },
);

const validPackages = [
  '@backstage/plugin-catalog',
  '@backstage/plugin-catalog-backend',
];

function location(search = '', hash = '') {
  return {
    pathname: '/plugins/backstage-software-catalog',
    search,
    hash,
  };
}

describe('usePackageWorkspaceState', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockUseLocation.mockReturnValue(location());
  });

  it.each(['', '?tab=install', '?package=unknown&tab=install'])(
    'resolves %p to the default package README',
    search => {
      mockUseLocation.mockReturnValue(location(search));
      const { result } = renderHook(() =>
        usePackageWorkspaceState(validPackages, '@backstage/plugin-catalog'),
      );

      expect(result.current.selectedPackageName).toBe(
        '@backstage/plugin-catalog',
      );
      expect(result.current.selectedTab).toBe('readme');
    },
  );

  it('defaults valid packages to README and follows URL changes', () => {
    mockUseLocation.mockReturnValue(
      location('?package=%40backstage%2Fplugin-catalog&tab=unknown'),
    );
    const { result, rerender } = renderHook(() =>
      usePackageWorkspaceState(validPackages, '@backstage/plugin-catalog'),
    );
    expect(result.current.selectedPackageName).toBe(
      '@backstage/plugin-catalog',
    );
    expect(result.current.selectedTab).toBe('readme');

    mockUseLocation.mockReturnValue(
      location('?package=%40backstage%2Fplugin-catalog-backend&tab=install'),
    );
    rerender();
    expect(result.current.selectedPackageName).toBe(
      '@backstage/plugin-catalog-backend',
    );
    expect(result.current.selectedTab).toBe('install');
  });

  it('writes complete, shareable package state and preserves the URL hash', () => {
    mockUseLocation.mockReturnValue(location('', '#details'));
    const { result, rerender } = renderHook(() =>
      usePackageWorkspaceState(validPackages, '@backstage/plugin-catalog'),
    );

    act(() => result.current.selectPackage('@backstage/plugin-catalog'));
    expect(mockPush).toHaveBeenLastCalledWith({
      pathname: '/plugins/backstage-software-catalog',
      search: '?package=%40backstage%2Fplugin-catalog&tab=readme',
      hash: '#details',
    });

    mockUseLocation.mockReturnValue(
      location('?package=%40backstage%2Fplugin-catalog&tab=readme', '#details'),
    );
    rerender();
    act(() => result.current.selectTab('configure'));
    expect(mockPush).toHaveBeenLastCalledWith({
      pathname: '/plugins/backstage-software-catalog',
      search: '?package=%40backstage%2Fplugin-catalog&tab=configure',
      hash: '#details',
    });
  });
});
