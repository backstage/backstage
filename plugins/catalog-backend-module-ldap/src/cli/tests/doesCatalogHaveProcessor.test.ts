import { doesCatalogHaveProcessor } from '../doesCatalogHaveProcessor';
import { basicCatalogFile } from '../mocks/basicCatalogFile';
import { basicCatalogFileWithProcessor } from '../mocks/basicCatalogFileWithProcessor';

/*
 * Copyright 2021 The Backstage Authors
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
describe('doesCatalogHaveProcessor', () => {
  it('should tell us if we already add an LDAP processor', () => {
    expect(doesCatalogHaveProcessor(basicCatalogFile)).toEqual(false);
  });
  it("should tell us if we don't add an LDAP processor", () => {
    expect(doesCatalogHaveProcessor(basicCatalogFileWithProcessor)).toBe(true);
  });
});
