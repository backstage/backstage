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
import * as http from 'http';
import * as https from 'https';

/**
 * Reads some base options out of a config object.
 *
 * @param config The root of a backend config object
 * @returns A base options object
 *
 * @example
 * ```json
 * {
 *   baseUrl: "http://localhost:7000",
 *   listen: "0.0.0.0:7000"
 * }
 * ```
 */
export function createHttpServer(app: express.Express): http.Server {
  return http.createServer(app);
}


export function createHttpsServer(app: express.Express): http.Server {
  return https.createServer(app);
}