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

import inquirer from 'inquirer';
import { pickInstance } from './prompt';
import * as storage from './storage';

jest.mock('inquirer');
jest.mock('./storage');

const mockStorage = storage as jest.Mocked<typeof storage>;
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('prompt', () => {
  describe('pickInstance', () => {
    const mockInstances = [
      {
        name: 'production',
        baseUrl: 'https://backstage.example.com',
        clientId: 'prod-client',
        issuedAt: Date.now(),
        accessToken: 'prod-token',
        accessTokenExpiresAt: Date.now() + 3600_000,
        selected: true,
      },
      {
        name: 'staging',
        baseUrl: 'https://staging.backstage.example.com',
        clientId: 'staging-client',
        issuedAt: Date.now(),
        accessToken: 'staging-token',
        accessTokenExpiresAt: Date.now() + 3600_000,
        selected: false,
      },
      {
        name: 'local',
        baseUrl: 'http://localhost:7007',
        clientId: 'local-client',
        issuedAt: Date.now(),
        accessToken: 'local-token',
        accessTokenExpiresAt: Date.now() + 3600_000,
        selected: false,
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return instance by name if provided', async () => {
      mockStorage.getInstanceByName.mockResolvedValue(mockInstances[1]);

      const result = await pickInstance('staging');

      expect(result).toEqual(mockInstances[1]);
      expect(mockStorage.getInstanceByName).toHaveBeenCalledWith('staging');
      expect(mockInquirer.prompt).not.toHaveBeenCalled();
    });

    it('should prompt for instance and show selected instance with asterisk prefix', async () => {
      // Test with production selected
      mockStorage.getAllInstances.mockResolvedValue({
        instances: mockInstances,
        selected: mockInstances[0],
      });
      mockInquirer.prompt.mockResolvedValue({ choice: 'staging' });

      const result = await pickInstance();

      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'list',
          name: 'choice',
          message: 'Select instance:',
          choices: [
            {
              name: '* production (https://backstage.example.com)',
              value: 'production',
            },
            {
              name: '  staging (https://staging.backstage.example.com)',
              value: 'staging',
            },
            {
              name: '  local (http://localhost:7007)',
              value: 'local',
            },
          ],
          default: 'production',
        },
      ]);
      expect(result).toEqual(mockInstances[1]);

      // Test with staging selected
      mockStorage.getAllInstances.mockResolvedValue({
        instances: mockInstances,
        selected: mockInstances[1],
      });
      mockInquirer.prompt.mockResolvedValue({ choice: 'staging' });

      await pickInstance();

      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          choices: [
            {
              name: '  production (https://backstage.example.com)',
              value: 'production',
            },
            {
              name: '* staging (https://staging.backstage.example.com)',
              value: 'staging',
            },
            {
              name: '  local (http://localhost:7007)',
              value: 'local',
            },
          ],
          default: 'staging',
        }),
      ]);
    });

    it('should throw error if no instances are available', async () => {
      mockStorage.getAllInstances.mockResolvedValue({
        instances: [],
        selected: undefined,
      });

      await expect(pickInstance()).rejects.toThrow(
        'No instances found. Run "auth login" to authenticate first.',
      );
    });

    it('should throw error if selected instance is not found', async () => {
      mockStorage.getAllInstances.mockResolvedValue({
        instances: mockInstances,
        selected: mockInstances[0],
      });
      mockInquirer.prompt.mockResolvedValue({ choice: 'non-existent' });

      await expect(pickInstance()).rejects.toThrow(
        "Instance 'non-existent' not found",
      );
    });

    it('should handle single instance and use selected instance as default', async () => {
      // Test single instance
      const singleInstance = [mockInstances[0]];
      mockStorage.getAllInstances.mockResolvedValue({
        instances: singleInstance,
        selected: mockInstances[0],
      });
      mockInquirer.prompt.mockResolvedValue({ choice: 'production' });

      const result = await pickInstance();

      expect(result).toEqual(mockInstances[0]);
      expect(mockInquirer.prompt).toHaveBeenCalled();

      // Test default selection matches selected instance
      const selectedInstance = mockInstances[2];
      mockStorage.getAllInstances.mockResolvedValue({
        instances: mockInstances,
        selected: selectedInstance,
      });
      mockInquirer.prompt.mockResolvedValue({ choice: 'local' });

      await pickInstance();

      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          default: 'local',
        }),
      ]);
    });
  });
});
