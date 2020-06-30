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

const normalizeBaseURL = (baseURL: string): string => {
  const url = new URL(baseURL);
  url.pathname = url.pathname.replace(/([^/])$/, '$1/');
  return url.toString();
};

export default class URLParser {
  constructor(public baseURL: string, public pathname: string) {
    this.baseURL = normalizeBaseURL(baseURL);
  }

  parse(): string {
    return new URL(this.pathname, this.baseURL).toString();
  }
}
