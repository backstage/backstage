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

export default class URLFormatter {
  constructor(public baseURL: string) {}

  formatBaseURL(): string {
    return this.normalizeURL(this.baseURL);
  }

  formatURL(pathname: string): string {
    return this.normalizeURL(new URL(pathname, this.baseURL).toString());
  }

  private normalizeURL(urlString: string): string {
    const url = new URL(urlString);
    const filename: string = url.pathname.split('/').pop() ?? url.pathname;
    const isDir: boolean = filename.includes('.') === false;

    if (isDir) {
      url.pathname = url.pathname.replace(/([^/])$/, '$1/');
    }

    return url.toString();
  }
}
