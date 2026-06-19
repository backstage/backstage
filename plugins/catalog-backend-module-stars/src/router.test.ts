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
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { StarsDatabase } from './database/StarsDatabase';

const mockDatabase = {
  getStars: jest.fn(),
  star: jest.fn(),
  unstar: jest.fn(),
  getStarCount: jest.fn(),
};

const mockHttpAuth = {
  credentials: jest.fn().mockResolvedValue({}),
};

const mockUserInfo = {
  getUserInfo: jest
    .fn()
    .mockResolvedValue({ userEntityRef: 'user:default/tester' }),
};

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      database: mockDatabase as unknown as StarsDatabase,
      httpAuth: mockHttpAuth as any,
      userInfo: mockUserInfo as any,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    mockHttpAuth.credentials.mockResolvedValue({});
    mockUserInfo.getUserInfo.mockResolvedValue({
      userEntityRef: 'user:default/tester',
    });
  });

  it('GET / should return stars', async () => {
    mockDatabase.getStars.mockResolvedValue(['component:default/comp1']);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ items: ['component:default/comp1'] });
    expect(mockDatabase.getStars).toHaveBeenCalledWith('user:default/tester');
  });

  it('PUT /:entityRef should star entity', async () => {
    mockDatabase.star.mockResolvedValue(undefined);

    const response = await request(app).put(
      `/${encodeURIComponent('component:default/comp1')}`,
    );
    expect(response.status).toBe(204);
    expect(mockDatabase.star).toHaveBeenCalledWith(
      'user:default/tester',
      'component:default/comp1',
    );
  });

  it('DELETE /:entityRef should unstar entity', async () => {
    mockDatabase.unstar.mockResolvedValue(undefined);

    const response = await request(app).delete(
      `/${encodeURIComponent('component:default/comp1')}`,
    );
    expect(response.status).toBe(204);
    expect(mockDatabase.unstar).toHaveBeenCalledWith(
      'user:default/tester',
      'component:default/comp1',
    );
  });

  it('GET /count/:entityRef should return count', async () => {
    mockDatabase.getStarCount.mockResolvedValue(5);

    const response = await request(app).get(
      `/count/${encodeURIComponent('component:default/comp1')}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ count: 5 });
    expect(mockDatabase.getStarCount).toHaveBeenCalledWith(
      'component:default/comp1',
    );
  });
});
