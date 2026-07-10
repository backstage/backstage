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

import { useContext, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import {
  createMockContract,
  createMockNavigationController,
} from '@backstage/frontend-test-utils';
import { NestedRoutingContractProvider } from './NestedRoutingContractProvider';
import { RoutingContractContext } from './RoutingContractContext';
import { navigationControllerApiRef } from './NavigationControllerApi';
import type { RoutingContract } from './RoutingContract';

function ContractProbe() {
  const contract = useContext(RoutingContractContext);
  return (
    <span data-testid="contract">
      {contract ? contract.basePath : '<none>'}
    </span>
  );
}

function renderNested(options: {
  parentContract?: RoutingContract;
  subPath: string;
  createContract: jest.Mock;
}) {
  const { parentContract, subPath, createContract } = options;
  const navigationController = createMockNavigationController();
  navigationController.createContract = createContract;

  const wrapped = (children: ReactNode) =>
    parentContract ? (
      <RoutingContractContext.Provider value={parentContract}>
        {children}
      </RoutingContractContext.Provider>
    ) : (
      children
    );

  return render(
    <TestApiProvider
      apis={[[navigationControllerApiRef, navigationController]]}
    >
      {wrapped(
        <NestedRoutingContractProvider subPath={subPath}>
          <ContractProbe />
        </NestedRoutingContractProvider>,
      )}
    </TestApiProvider>,
  );
}

describe('NestedRoutingContractProvider', () => {
  it('mints a child contract via navigationController.createContract with joined basePath and routePattern', () => {
    const parentContract = {
      ...createMockContract({ basePath: '/catalog/default/component/foo' }),
      routePattern: '/catalog/:namespace/:kind/:name',
    };
    const childContract = createMockContract({
      basePath: '/catalog/default/component/foo/docs',
    });
    const createContract = jest.fn().mockReturnValue(childContract);

    renderNested({ parentContract, subPath: 'docs', createContract });

    expect(createContract).toHaveBeenCalledWith(
      '/catalog/default/component/foo/docs',
      { routePattern: '/catalog/:namespace/:kind/:name/docs' },
    );
    expect(screen.getByTestId('contract')).toHaveTextContent(
      '/catalog/default/component/foo/docs',
    );
  });

  it('falls back to the parent basePath as the pattern when the parent has no routePattern', () => {
    const parentContract = createMockContract({ basePath: '/settings' });
    const childContract = createMockContract({
      basePath: '/settings/general',
    });
    const createContract = jest.fn().mockReturnValue(childContract);

    renderNested({ parentContract, subPath: 'general', createContract });

    expect(createContract).toHaveBeenCalledWith('/settings/general', {
      routePattern: '/settings/general',
    });
  });

  it('renders children directly without minting a contract when there is no parent contract', () => {
    const createContract = jest.fn();

    renderNested({ subPath: 'docs', createContract });

    expect(createContract).not.toHaveBeenCalled();
    expect(screen.getByTestId('contract')).toHaveTextContent('<none>');
  });
});
