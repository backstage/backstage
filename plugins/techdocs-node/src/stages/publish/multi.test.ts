/*
 * Copyright 2020 The Backstage Authors
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

import express from 'express';
import { MultiPublisher } from './multi';
import {
  PublisherBase,
  PublishRequest,
  PublishResponse,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';
import { Entity } from '@backstage/catalog-model';

describe('MultiPublisher', () => {
  const createMockPublisher = (): jest.Mocked<PublisherBase> => ({
    getReadiness: jest.fn(),
    publish: jest.fn(),
    fetchTechDocsMetadata: jest.fn(),
    docsRouter: jest.fn(),
    hasDocsBeenGenerated: jest.fn(),
    migrateDocsCase: jest.fn(),
  });

  it('should throw an error if no publishers are provided', () => {
    expect(() => new MultiPublisher([])).toThrow(
      'MultiPublisher requires at least one publisher',
    );
  });

  describe('getReadiness', () => {
    it('returns isAvailable true when all publishers are available', async () => {
      const pub1 = createMockPublisher();
      pub1.getReadiness.mockResolvedValue({ isAvailable: true });
      const pub2 = createMockPublisher();
      pub2.getReadiness.mockResolvedValue({ isAvailable: true });

      const multi = new MultiPublisher([pub1, pub2]);
      const result = await multi.getReadiness();

      expect(result.isAvailable).toBe(true);
      expect(pub1.getReadiness).toHaveBeenCalled();
      expect(pub2.getReadiness).toHaveBeenCalled();
    });

    it('returns isAvailable false when any publisher is not available', async () => {
      const pub1 = createMockPublisher();
      pub1.getReadiness.mockResolvedValue({ isAvailable: true });
      const pub2 = createMockPublisher();
      pub2.getReadiness.mockResolvedValue({ isAvailable: false });

      const multi = new MultiPublisher([pub1, pub2]);
      const result = await multi.getReadiness();

      expect(result.isAvailable).toBe(false);
    });
  });

  describe('publish', () => {
    it('publishes to all publishers and returns primary response', async () => {
      const pub1 = createMockPublisher();
      const pub2 = createMockPublisher();

      pub1.publish.mockResolvedValue({
        remoteUrl: 'http://pub1',
      } as PublishResponse);
      pub2.publish.mockResolvedValue({
        remoteUrl: 'http://pub2',
      } as PublishResponse);

      const multi = new MultiPublisher([pub1, pub2]);
      const request = {} as PublishRequest;

      const result = await multi.publish(request);

      expect(result?.remoteUrl).toBe('http://pub1');
      expect(pub1.publish).toHaveBeenCalledWith(request);
      expect(pub2.publish).toHaveBeenCalledWith(request);
    });
  });

  describe('fetchTechDocsMetadata', () => {
    it('fetches metadata from primary publisher', async () => {
      const pub1 = createMockPublisher();
      const pub2 = createMockPublisher();

      pub1.fetchTechDocsMetadata.mockResolvedValue({
        site_name: 'pub1',
      } as TechDocsMetadata);

      const multi = new MultiPublisher([pub1, pub2]);
      const result = await multi.fetchTechDocsMetadata({} as any);

      expect(result.site_name).toBe('pub1');
      expect(pub1.fetchTechDocsMetadata).toHaveBeenCalled();
      expect(pub2.fetchTechDocsMetadata).not.toHaveBeenCalled();
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('checks generation on primary publisher', async () => {
      const pub1 = createMockPublisher();
      const pub2 = createMockPublisher();

      pub1.hasDocsBeenGenerated.mockResolvedValue(true);

      const multi = new MultiPublisher([pub1, pub2]);
      const result = await multi.hasDocsBeenGenerated({} as Entity);

      expect(result).toBe(true);
      expect(pub1.hasDocsBeenGenerated).toHaveBeenCalled();
      expect(pub2.hasDocsBeenGenerated).not.toHaveBeenCalled();
    });
  });

  describe('docsRouter', () => {
    it('returns router from primary publisher', () => {
      const pub1 = createMockPublisher();
      const pub2 = createMockPublisher();

      const mockRouter = express.Router();
      pub1.docsRouter.mockReturnValue(mockRouter);

      const multi = new MultiPublisher([pub1, pub2]);
      const result = multi.docsRouter();

      expect(result).toBe(mockRouter);
      expect(pub1.docsRouter).toHaveBeenCalled();
      expect(pub2.docsRouter).not.toHaveBeenCalled();
    });
  });
});
