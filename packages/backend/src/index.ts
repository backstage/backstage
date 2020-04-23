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
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { testRouter } from './test';

const PORT = parseInt(process.env.PORT ?? '', 10) || 7000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/test', testRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
