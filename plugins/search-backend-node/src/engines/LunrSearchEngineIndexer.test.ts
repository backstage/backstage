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

import lunr from 'lunr';
import { range } from 'lodash';
import { TestPipeline } from '../test-utils';
import { LunrSearchEngineIndexer } from './LunrSearchEngineIndexer';

const lunrBuilderAddSpy = jest.fn();
const lunrBuilderRefSpy = jest.fn();
const lunrBuilderFieldSpy = jest.fn();
const lunrBuilderPipelineAddSpy = jest.fn();
const lunrBuilderSearchPipelineAddSpy = jest.fn();

jest.mock('lunr', () => {
  const actualLunr = jest.requireActual('lunr');
  return {
    ...actualLunr,
    Builder: jest.fn().mockImplementation(() => {
      const actualBuilder = new actualLunr.Builder();
      actualBuilder.add = lunrBuilderAddSpy;
      actualBuilder.ref = lunrBuilderRefSpy;
      actualBuilder.field = lunrBuilderFieldSpy;
      actualBuilder.pipeline.add = lunrBuilderPipelineAddSpy;
      actualBuilder.searchPipeline.add = lunrBuilderSearchPipelineAddSpy;
      return actualBuilder;
    }),
  };
});

describe('LunrSearchEngineIndexer', () => {
  let indexer: LunrSearchEngineIndexer;

  beforeEach(() => {
    jest.clearAllMocks();
    indexer = new LunrSearchEngineIndexer();
  });

  it('should index documents', async () => {
    const documents = [
      {
        title: 'testTerm',
        text: 'testText',
        location: 'test/location',
      },
    ];

    await TestPipeline.withSubject(indexer).withDocuments(documents).execute();

    expect(lunrBuilderAddSpy).toHaveBeenCalledWith(documents[0]);
  });

  it('should index documents in bulk', async () => {
    const documents = range(350).map(i => ({
      title: `Hello World ${i}`,
      text: 'Lorem Ipsum',
      location: `location-${i}`,
    }));

    await TestPipeline.withSubject(indexer).withDocuments(documents).execute();
    expect(lunrBuilderAddSpy).toHaveBeenCalledTimes(350);
  });

  it('should initialize schema', async () => {
    const documents = [
      {
        title: 'testTerm',
        text: 'testText',
        location: 'test/location',
        extra: 'field',
      },
    ];

    await TestPipeline.withSubject(indexer).withDocuments(documents).execute();

    // Builder ref should be set to location (and only once).
    expect(lunrBuilderRefSpy).toHaveBeenCalledTimes(1);
    expect(lunrBuilderRefSpy).toHaveBeenLastCalledWith('location');

    // Builder fields should be based on document fields.
    expect(lunrBuilderFieldSpy).toHaveBeenCalledTimes(4);
    expect(lunrBuilderFieldSpy).toHaveBeenCalledWith('title');
    expect(lunrBuilderFieldSpy).toHaveBeenCalledWith('text');
    expect(lunrBuilderFieldSpy).toHaveBeenCalledWith('location');
    expect(lunrBuilderFieldSpy).toHaveBeenCalledWith('extra');
  });

  it('should configure lunr pipeline', async () => {
    expect(lunrBuilderSearchPipelineAddSpy).toHaveBeenLastCalledWith(
      lunr.stemmer,
    );
    expect(lunrBuilderPipelineAddSpy).toHaveBeenCalledWith(
      ...[lunr.trimmer, lunr.stopWordFilter, lunr.stemmer],
    );
  });
});
