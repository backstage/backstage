/*
 * Copyright 2025 The Backstage Authors
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

import { vi, type Mock } from 'vitest';
import { render } from '@testing-library/react';

// We need to mock react-router-dom hooks used by useInitialRedirect
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Import the module from which the hook is defined
import { useInitialRedirect } from './dom';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

describe('useInitialRedirect', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockReset();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useLocation as Mock).mockReturnValue({
      pathname: '/docs/default/Component/backstage-demo',
    });
    // Simulate that no current path is provided
    (useParams as Mock).mockReturnValue({ '*': '' });
  });

  const TestComponent: React.FC<{ defaultPath?: string }> = ({
    defaultPath,
  }) => {
    // Call hook that should trigger a redirect on mount only if defaultPath is a non-empty string.
    useInitialRedirect(defaultPath);
    return <div>Test</div>;
  };

  it('should not navigate when defaultPath is undefined', () => {
    render(<TestComponent defaultPath={undefined} />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should navigate when defaultPath is a non-empty string', () => {
    render(<TestComponent defaultPath="/overview" />);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/docs/default/Component/backstage-demo/overview',
      { replace: true },
    );
  });

  it('should not navigate if currPath is non-empty', () => {
    // Override useParams to simulate a non-empty currPath
    (useParams as Mock).mockReturnValue({ '*': 'existing-path' });
    render(<TestComponent defaultPath={undefined} />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
