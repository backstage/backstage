/*
 * Copyright 2020 Spotify AB
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

import { PassThrough } from 'stream';
import winston from 'winston';
import { CatalogLogic } from './CatalogLogic';
import { Catalog } from './types';

describe('CatalogLogic', () => {
  const logger = winston.createLogger({
    transports: [new winston.transports.Stream({ stream: new PassThrough() })],
  });

  describe('refreshLocations', () => {
    it('works with no locations added', async () => {
      const catalog = ({
        addOrUpdateComponent: jest.fn(),
        locations: jest.fn(() => []),
      } as unknown) as Catalog;
      const locationReader = jest.fn();

      await expect(
        CatalogLogic.refreshLocations(catalog, locationReader, logger),
      ).resolves.toBeUndefined();
      expect(locationReader).not.toHaveBeenCalled();
    });

    it('can update a single location', async () => {
      const catalog = ({
        addOrUpdateComponent: jest.fn(),
        locations: jest.fn(() => [
          {
            id: '123',
            type: 'some',
            target: 'thing',
          },
        ]),
      } as unknown) as Catalog;

      const locationReader = jest.fn().mockResolvedValue([
        {
          name: 'c1',
        },
      ]);

      await expect(
        CatalogLogic.refreshLocations(catalog, locationReader, logger),
      ).resolves.toBeUndefined();
      expect(locationReader).toHaveBeenCalledTimes(1);
      expect(locationReader).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: 'some' }),
      );
      expect(catalog.addOrUpdateComponent).toHaveBeenCalledTimes(1);
      expect(catalog.addOrUpdateComponent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ name: 'c1' }),
      );
    });
  });
});
