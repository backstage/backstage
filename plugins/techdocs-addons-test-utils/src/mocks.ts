/*
 * Copyright 2022 The Backstage Authors
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

export const useTechDocsReaderDom = jest.fn();
export const useParams = jest.fn();

jest.mock('../reader/components/TechDocsReaderPageContent/dom', () => ({
  ...(jest.requireActual(
    '../reader/components/TechDocsReaderPageContent/dom',
  ) as {}),
  useTechDocsReaderDom,
}));

jest.mock('../reader/components/TechDocsReaderPageContent/context', () => ({
  ...(jest.requireActual(
    '../reader/components/TechDocsReaderPageContent/context',
  ) as {}),
  withTechDocsReaderProvider: jest.fn(x => x),
}));

jest.mock('../reader/components/TechDocsStateIndicator', () => ({
  ...(jest.requireActual('../reader/components/TechDocsStateIndicator') as {}),
  TechDocsStateIndicator: jest.fn(() => null),
}));
// todo(backstage/techdocs-core): Use core test-utils' `routeEntries` option.
jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as {}),
  useParams,
}));
