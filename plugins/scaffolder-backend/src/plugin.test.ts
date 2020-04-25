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

import { router } from './plugin';

import { Repository, Template } from 'lib/repo';
import supertest from 'supertest';
import express from 'express';


describe('scaffolder backend', () => {
  const app = express().use(router);
  const mockTemplate: Template = {
    id: 'test-mock-template',
    name: 'mock',
    description: 'test for tests',
    ownerId: 'lol',
  };

  it('should return a list of templates that are in the directory which the plugin is initialised in', async () => {
    jest.spyOn(Repository, 'list').mockResolvedValue([mockTemplate]);

    const { body } = await supertest(app)
      .get('/v1/templates')
      .send();

    expect(body.length).toBe(1);
    expect(body[0]).toStrictEqual(mockTemplate);
  });
});
