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

import { IndexableDocument } from '@backstage/plugin-search-common';
import { DecoratorBase } from './DecoratorBase';
import { TestPipeline } from '../test-utils';

const decorateSpy = jest.fn().mockResolvedValue(undefined);
const initializeSpy = jest.fn().mockResolvedValue(undefined);
const finalizeSpy = jest.fn().mockResolvedValue(undefined);

class ConcreteDecorator extends DecoratorBase {
  public initialize(): Promise<void> {
    return initializeSpy();
  }
  public decorate(
    document: IndexableDocument,
  ): Promise<IndexableDocument | IndexableDocument[] | undefined> {
    return decorateSpy(document);
  }
  public finalize(): Promise<void> {
    return finalizeSpy();
  }
}

describe('DecoratorBase', () => {
  const document = {
    title: 'Some Document',
    text: 'Some document text.',
    location: '/some/location',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should work end-to-end', async () => {
    decorateSpy.mockImplementation(doc => ({
      ...doc,
      transformed: true,
    }));

    const decorator = new ConcreteDecorator();
    const { documents } = await TestPipeline.withSubject(decorator)
      .withDocuments([document, document, document])
      .execute();

    expect(documents.length).toBe(3);
    expect((documents[0] as unknown as any).transformed).toBe(true);
    expect((documents[1] as unknown as any).transformed).toBe(true);
    expect((documents[2] as unknown as any).transformed).toBe(true);
  });

  it('should allow filtering', async () => {
    decorateSpy.mockResolvedValue(undefined);

    const decorator = new ConcreteDecorator();
    const { documents } = await TestPipeline.withSubject(decorator)
      .withDocuments([document, document, document])
      .execute();

    expect(decorateSpy).toHaveBeenCalledTimes(3);
    expect(documents.length).toBe(0);
  });

  it('should allow fanning', async () => {
    decorateSpy.mockImplementation(doc => {
      return [doc, doc];
    });

    const decorator = new ConcreteDecorator();
    const { documents } = await TestPipeline.withSubject(decorator)
      .withDocuments([document, document, document])
      .execute();

    expect(decorateSpy).toHaveBeenCalledTimes(3);
    expect(documents.length).toBe(6);
  });

  it('should call initialize at construction', () => {
    // @ts-expect-error
    const _indexer = new ConcreteDecorator();

    return new Promise<void>(done => {
      // Allow initialization to complete.
      setImmediate(() => {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should emit error if initialization throws', () => {
    // Cause the initializer to throw.
    const expectedError = new Error('some error');
    initializeSpy.mockRejectedValue(expectedError);
    const decorator = new ConcreteDecorator();

    return new Promise<void>(done => {
      // Listen for the error and assert it's what was thrown.
      decorator.on('error', error => {
        expect(error).toStrictEqual(expectedError);
        done();
      });

      // Write a document to force the error state to become known.
      decorator.write(document);
    });
  });

  it('should emit error if index throws', () => {
    // Cause the indexer to throw.
    const expectedError = new Error('decorate error');
    decorateSpy.mockRejectedValue(expectedError);
    const decorator = new ConcreteDecorator();

    return new Promise<void>(done => {
      // Listen for the error and assert it's what was thrown.
      decorator.on('error', error => {
        expect(error).toStrictEqual(expectedError);
        done();
      });

      decorator.write(document);
    });
  });

  it('should emit error if finalize throws', () => {
    // Cause the indexer to throw.
    const expectedError = new Error('finalize error');
    finalizeSpy.mockRejectedValue(expectedError);
    const decorator = new ConcreteDecorator();

    return new Promise<void>(done => {
      // Listen for the error and assert it's what was thrown.
      decorator.on('error', error => {
        expect(error).toStrictEqual(expectedError);
        done();
      });

      decorator.end();
    });
  });
});
