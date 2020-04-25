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
import express from 'express';

export const router = express.Router();

router.get('/v1/templates', async (_, res) => {
  const templates = await Repository.list();
  res.status(200).json(templates);
});

router.get('/v1/template/:templateId', async (_, res) => {
  res
    .status(200)
    .send([
      { id: 'component1' },
      { id: 'component2' },
      { id: 'component3' },
      { id: 'component4' },
    ]);
});

router.post('/v1/jobs', async (_, res) => {
  res
    .status(200)
    .send([
      { id: 'component1' },
      { id: 'component2' },
      { id: 'component3' },
      { id: 'component4' },
    ]);
});

router.get('/v1/jobs', async (_, res) => {
  res
    .status(200)
    .send([
      { id: 'component1' },
      { id: 'component2' },
      { id: 'component3' },
      { id: 'component4' },
    ]);
});

router.get('/v1/job/:jobId', async (_, res) => {
  res
    .status(200)
    .send([
      { id: 'component1' },
      { id: 'component2' },
      { id: 'component3' },
      { id: 'component4' },
    ]);
});
