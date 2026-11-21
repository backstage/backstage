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

export type PackageTab = 'readme' | 'install';

export interface PackageWorkspaceState {
  selectedPackageName: string | undefined;
  selectedTab: PackageTab;
  selectPackage(npmPackageName: string): void;
  selectTab(tab: PackageTab): void;
}

function isPackageTab(value: string): value is PackageTab {
  return value === 'readme' || value === 'install';
}

// The package is a query parameter and the tab is the location hash, for
// example `?package=%40backstage%2Fplugin-catalog-backend#install`.
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
  const requestedTab = location.hash.replace(/^#/, '');
  const selectedTab: PackageTab = isPackageTab(requestedTab)
    ? requestedTab
    : 'readme';

  return {
    selectedPackageName,
    selectedTab,
    // Switching packages is a navigation the back button should undo, but
    // switching tabs within a package only replaces the current entry.
    selectPackage: npmPackageName => {
      const search = new URLSearchParams({ package: npmPackageName });
      history.push({
        pathname: location.pathname,
        search: `?${search.toString()}`,
        hash: location.hash,
      });
    },
    selectTab: tab => {
      history.replace({
        pathname: location.pathname,
        search: location.search,
        hash: `#${tab}`,
      });
    },
  };
}
