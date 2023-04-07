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
import { TestPipeline } from '@backstage/plugin-search-backend-node';
import { range } from 'lodash';
import { Transform } from 'stream';
import { PgSearchEngineIndexer } from './PgSearchEngineIndexer';
import { DatabaseStore } from '../database';

describe('PgSearchEngineIndexer', () => {
  const tx = {
    rollback: jest.fn(),
    commit: jest.fn(),
  } as any;
  let database: jest.Mocked<DatabaseStore>;
  let indexer: PgSearchEngineIndexer;

  beforeEach(() => {
    jest.clearAllMocks();
    database = {
      transaction: jest.fn().mockImplementation(fn => fn(tx)),
      getTransaction: jest.fn().mockReturnValue(tx),
      insertDocuments: jest.fn(),
      query: jest.fn(),
      completeInsert: jest.fn(),
      prepareInsert: jest.fn(),
    };
    indexer = new PgSearchEngineIndexer({
      batchSize: 100,
      type: 'my-type',
      databaseStore: database,
    });
  });

  it('should insert documents', async () => {
    const documents = [
      { title: 'Hello World', text: 'Lorem Ipsum', location: 'location-1' },
      {
        location: 'location-2',
        text: 'Hello World',
        title: 'Dolor sit amet',
      },
    ];

    await TestPipeline.fromIndexer(indexer).withDocuments(documents).execute();

    expect(database.getTransaction).toHaveBeenCalledTimes(1);
    expect(database.prepareInsert).toHaveBeenCalledTimes(1);
    expect(database.insertDocuments).toHaveBeenCalledWith(
      tx,
      'my-type',
      documents,
    );
    expect(database.completeInsert).toHaveBeenCalledWith(tx, 'my-type');
    expect(tx.commit).toHaveBeenCalled();
  });

  it('should batch insert documents', async () => {
    const documents = range(350).map(i => ({
      title: `Hello World ${i}`,
      text: 'Lorem Ipsum',
      location: `location-${i}`,
    }));

    await TestPipeline.fromIndexer(indexer).withDocuments(documents).execute();

    expect(database.getTransaction).toHaveBeenCalledTimes(1);
    expect(database.prepareInsert).toHaveBeenCalledTimes(1);
    expect(database.insertDocuments).toHaveBeenCalledTimes(4);
    expect(database.completeInsert).toHaveBeenCalledWith(tx, 'my-type');
  });

  it('should rollback transaction if no documents indexed', async () => {
    await TestPipeline.fromIndexer(indexer).withDocuments([]).execute();

    expect(database.getTransaction).toHaveBeenCalledTimes(1);
    expect(database.insertDocuments).not.toHaveBeenCalled();
    expect(database.completeInsert).not.toHaveBeenCalled();
    expect(tx.rollback).toHaveBeenCalled();
  });

  it('should close out stream and bubble up error on prepare', async () => {
    const expectedError = new Error('Prepare error');
    const documents = [
      {
        title: `Hello World`,
        text: 'Lorem Ipsum',
        location: `location`,
      },
    ];

    database.prepareInsert.mockRejectedValueOnce(expectedError);
    const result = await TestPipeline.fromIndexer(indexer)
      .withDocuments(documents)
      .execute();

    expect(database.getTransaction).toHaveBeenCalledTimes(1);
    expect(database.insertDocuments).not.toHaveBeenCalled();
    expect(database.completeInsert).not.toHaveBeenCalled();
    expect(result.error).toBe(expectedError);
    expect(tx.rollback).toHaveBeenCalledWith(expectedError);
  });

  it('should close tx and bubble up error on insert', async () => {
    const expectedError = new Error('Index error');
    const documents = [
      {
        title: `Hello World`,
        text: 'Lorem Ipsum',
        location: `location`,
      },
    ];

    database.insertDocuments.mockRejectedValueOnce(expectedError);
    const result = await TestPipeline.fromIndexer(indexer)
      .withDocuments(documents)
      .execute();

    expect(database.getTransaction).toHaveBeenCalledTimes(1);
    expect(database.prepareInsert).toHaveBeenCalledTimes(1);
    expect(database.completeInsert).not.toHaveBeenCalled();
    expect(result.error).toBe(expectedError);
    expect(tx.rollback).toHaveBeenCalledWith(expectedError);
  });

  it('should close tx and bubble up error on completion', async () => {
    const expectedError = new Error('Completion error');
    const documents = [
      {
        title: `Hello World`,
        text: 'Lorem Ipsum',
        location: `location`,
      },
    ];

    database.completeInsert.mockRejectedValueOnce(expectedError);
    const result = await TestPipeline.fromIndexer(indexer)
      .withDocuments(documents)
      .execute();

    expect(database.getTransaction).toHaveBeenCalledTimes(1);
    expect(database.prepareInsert).toHaveBeenCalledTimes(1);
    expect(database.insertDocuments).toHaveBeenCalledTimes(1);
    expect(database.completeInsert).toHaveBeenCalledTimes(1);
    expect(result.error).toBe(expectedError);
    expect(tx.rollback).toHaveBeenCalledWith(expectedError);
  });

  it('should rollback transaction on upstream error', async () => {
    // Given a decorator that results in an error
    let counter = 0;
    const expectedError = new Error('Upstream error');
    const errorDecorator = new Transform({ objectMode: true });
    errorDecorator._transform = (chunk, _enc, cb) => {
      counter++;
      if (counter > 1) {
        cb(expectedError);
      } else {
        cb(undefined, chunk);
      }
    };

    // When the decorator is run in a pipeline with the PG indexer
    const result = await TestPipeline.fromIndexer(indexer)
      .withDecorator(errorDecorator)
      .withDocuments([
        { title: 'a', text: 'a', location: '/a' },
        { title: 'b', text: 'b', location: '/b' },
      ])
      .execute();

    // And we allow async teardown logic to complete
    await new Promise(resolve => setImmediate(resolve));

    // Then the transaction should have been closed with the expected error.
    expect(database.getTransaction).toHaveBeenCalledTimes(1);
    expect(database.completeInsert).not.toHaveBeenCalled();
    expect(result.error).toBe(expectedError);
    expect(tx.rollback).toHaveBeenCalledWith(expectedError);
  });
});
