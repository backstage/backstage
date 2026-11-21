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
import { useHistory, useLocation } from '@docusaurus/router';
import { useCallback } from 'react';

export type PackageTab = 'readme' | 'install' | 'configure';

export interface PackageWorkspaceState {
  selectedPackageName: string | undefined;
  selectedTab: PackageTab;
  selectPackage(npmPackageName: string): void;
  selectTab(tab: PackageTab): void;
}

function isPackageTab(value: string | null): value is PackageTab {
  return value === 'readme' || value === 'install' || value === 'configure';
}

export function usePackageWorkspaceState(
  validPackageNames: readonly string[],
  defaultPackageName: string,
): PackageWorkspaceState {
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const requestedPackage = params.get('package') ?? undefined;
  const hasValidRequestedPackage = validPackageNames.includes(
    requestedPackage ?? '',
  );
  const fallbackPackageName = validPackageNames.includes(defaultPackageName)
    ? defaultPackageName
    : validPackageNames[0];
  const selectedPackageName = hasValidRequestedPackage
    ? requestedPackage
    : fallbackPackageName;
  const requestedTab = params.get('tab');
  const selectedTab: PackageTab =
    hasValidRequestedPackage && isPackageTab(requestedTab)
      ? requestedTab
      : 'readme';

  const pushState = useCallback(
    (packageName: string, tab: PackageTab = 'readme') => {
      const search = new URLSearchParams();
      search.set('package', packageName);
      search.set('tab', tab);
      const query = search.toString();
      history.push({
        pathname: location.pathname,
        search: query ? `?${query}` : '',
        hash: location.hash,
      });
    },
    [history, location.hash, location.pathname],
  );

  return {
    selectedPackageName,
    selectedTab,
    selectPackage: npmPackageName => pushState(npmPackageName),
    selectTab: tab => {
      if (selectedPackageName) {
        pushState(selectedPackageName, tab);
      }
    },
  };
}
