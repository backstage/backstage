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
import {
  AuthorizeDecision,
  AuthorizeResult,
  PermissionAuthorizer,
} from '@backstage/plugin-permission-common';
import { DocumentTypeInfo } from '@backstage/plugin-search-backend-node';
import { IndexableDocument, SearchEngine } from '@backstage/search-common';
import {
  encodePageCursor,
  decodePageCursor,
  AuthorizedSearchEngine,
} from './AuthorizedSearchEngine';

describe('AuthorizedSearchEngine', () => {
  const typeUsers = 'users';
  const typeTemplates = 'templates';
  const typeServices = 'services';

  function generateSampleResults(type: string, withAuthorization?: boolean) {
    return Array(10)
      .fill(0)
      .map((_, index) => ({
        type,
        document: {
          title: `${type}_doc_${index}`,
          authorization: withAuthorization
            ? { resourceRef: `${type}_doc_${index}` }
            : undefined,
        } as IndexableDocument,
      }));
  }

  const allUsers = generateSampleResults(typeUsers);
  const allTemplates = generateSampleResults(typeTemplates);

  const results = allUsers.concat(allTemplates);

  const mockedQuery: jest.MockedFunction<SearchEngine['query']> = jest
    .fn()
    .mockImplementation(async () => ({ results }));

  const searchEngine: SearchEngine = {
    setTranslator: () => {
      throw new Error('Function not implemented. 1');
    },
    index: () => {
      throw new Error('Function not implemented.2');
    },
    query: mockedQuery,
  };

  const mockedAuthorize: jest.MockedFunction<
    PermissionAuthorizer['authorize']
  > = jest.fn();

  const permissionAuthorizer: PermissionAuthorizer = {
    authorize: mockedAuthorize,
  };

  const defaultTypes: Record<string, DocumentTypeInfo> = {
    [typeUsers]: {
      visibilityPermission: {
        name: 'search.users.read',
        attributes: { action: 'read' },
      },
    },
    [typeTemplates]: {
      visibilityPermission: {
        name: 'search.templates.read',
        attributes: { action: 'read' },
      },
    },
  };

  const authorizedSearchEngine = new AuthorizedSearchEngine(
    searchEngine,
    defaultTypes,
    permissionAuthorizer,
  );

  const options = { token: 'token' };

  const allowAll: PermissionAuthorizer['authorize'] = async queries => {
    return queries.map(() => ({
      result: AuthorizeResult.ALLOW,
    }));
  };

  beforeEach(() => {
    mockedQuery.mockClear();
    mockedAuthorize.mockClear();
  });

  it('should forward the parameters correctly', async () => {
    mockedAuthorize.mockImplementation(allowAll);
    const filters = { just: 1, a: 2, filter: 3 };
    await authorizedSearchEngine.query(
      { term: 'term', filters, types: ['one', 'two'] },
      options,
    );
    expect(mockedQuery).toHaveBeenCalledWith(
      {
        term: 'term',
        types: ['one', 'two'],
        filters,
      },
      { token: 'token' },
    );
  });

  it('should forward the default types if none are passed', async () => {
    mockedAuthorize.mockImplementation(allowAll);
    await authorizedSearchEngine.query({ term: '' }, options);
    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['users', 'templates'] },
      { token: 'token' },
    );
  });

  it('should return all the results if all queries are allowed', async () => {
    mockedAuthorize.mockImplementation(allowAll);

    await expect(
      authorizedSearchEngine.query({ term: '' }, options),
    ).resolves.toEqual({ results });
    expect(mockedAuthorize).toHaveBeenCalledTimes(1);
  });

  it('should batch authorized requests', async () => {
    mockedAuthorize.mockImplementation(allowAll);

    await authorizedSearchEngine.query(
      { term: '', types: [typeUsers, typeTemplates] },
      options,
    );
    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['users', 'templates'] },
      { token: 'token' },
    );
    expect(mockedAuthorize).toHaveBeenCalledTimes(1);
    expect(mockedAuthorize).toHaveBeenLastCalledWith(
      [
        { permission: defaultTypes[typeUsers].visibilityPermission },
        { permission: defaultTypes[typeTemplates].visibilityPermission },
      ],
      { token: 'token' },
    );
  });

  it('should skip sending request for types that are not allowed', async () => {
    mockedAuthorize.mockImplementation(async queries => {
      return queries.map(query => {
        if (
          query.permission.name ===
          defaultTypes.users.visibilityPermission?.name
        ) {
          return {
            result: AuthorizeResult.DENY,
          };
        }
        return {
          result: AuthorizeResult.ALLOW,
        };
      });
    });

    await authorizedSearchEngine.query({ term: '' }, options);

    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['templates'] },
      { token: 'token' },
    );

    expect(mockedAuthorize).toHaveBeenCalledTimes(1);
  });

  it('should perform result-by-result filtering', async () => {
    const usersWithAuth = generateSampleResults(typeUsers, true);
    const templatesWithAuth = generateSampleResults(typeTemplates, true);

    const resultsWithAuth = usersWithAuth.concat(templatesWithAuth);

    mockedQuery.mockImplementation(async () => ({
      results: resultsWithAuth,
    }));

    const userToBeReturned = 8;

    // TODO(vinzscam): I am not sure if such authorizer makes sense
    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (
          query.permission.name ===
          defaultTypes.users.visibilityPermission?.name
        ) {
          if (query.resourceRef) {
            return {
              result: query.resourceRef.endsWith(userToBeReturned.toString())
                ? AuthorizeResult.ALLOW
                : AuthorizeResult.DENY,
            };
          }
          return {
            result: AuthorizeResult.CONDITIONAL,
            // TODO(vinzscam): is something like this allowed?
            // I guess NO, but I am not sure.
            // if yes, who is responsible for evaluating this?
            conditions: { not: { rule: 'ok', params: [] } },
          };
        }

        return {
          result: AuthorizeResult.DENY,
        };
      }),
    );

    await expect(
      authorizedSearchEngine.query({ term: '' }, options),
    ).resolves.toEqual({ results: [usersWithAuth[userToBeReturned]] });

    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['users'] },
      { token: 'token' },
    );
  });

  it('should perform search until the target number of results is reached', async () => {
    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (query.resourceRef) {
          return { result: AuthorizeResult.ALLOW };
        }
        // TODO(vinzscam): again, not sure about this
        return { result: AuthorizeResult.CONDITIONAL } as AuthorizeDecision;
      }),
    );

    const usersWithAuth = generateSampleResults(typeUsers, true);
    const templatesWithAuth = generateSampleResults(typeTemplates, true);
    const servicesWithAuth = generateSampleResults(typeServices, true);

    mockedQuery
      .mockImplementationOnce(async () => ({
        results: usersWithAuth,
        nextPageCursor: encodePageCursor({ page: 1 }),
      }))
      .mockImplementationOnce(async () => ({
        results: templatesWithAuth,
        nextPageCursor: encodePageCursor({ page: 2 }),
      }))
      .mockImplementationOnce(async () => ({
        results: servicesWithAuth,
      }));

    const result = await authorizedSearchEngine.query({ term: '' }, options);

    expect(mockedQuery).toHaveBeenCalledTimes(3);
    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,
      { term: '', types: ['users', 'templates'] },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,
      { term: '', types: ['users', 'templates'], pageCursor: 'MQ==' },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      3,
      { term: '', types: ['users', 'templates'], pageCursor: 'Mg==' },
      { token: 'token' },
    );

    const expectedResult = [
      ...usersWithAuth,
      ...templatesWithAuth,
      ...servicesWithAuth,
    ].slice(0, 25);

    const expectedFirstRequestCursor = 'MQ==';
    expect(result).toEqual({
      results: expectedResult,
      nextPageCursor: expectedFirstRequestCursor,
    });
  });

  it('should discard results until the target cursor is reached', async () => {
    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (query.resourceRef) {
          return { result: AuthorizeResult.ALLOW };
        }
        // TODO(vinzscam): again, not sure about this
        return { result: AuthorizeResult.CONDITIONAL } as AuthorizeDecision;
      }),
    );

    const usersWithAuth = generateSampleResults(typeUsers, true);
    const templatesWithAuth = generateSampleResults(typeTemplates, true);
    const servicesWithAuth = generateSampleResults(typeServices, true);

    mockedQuery
      .mockImplementationOnce(async () => ({
        results: usersWithAuth,
        nextPageCursor: encodePageCursor({ page: 1 }),
      }))
      .mockImplementationOnce(async () => ({
        results: templatesWithAuth,
        nextPageCursor: encodePageCursor({ page: 2 }),
      }))
      .mockImplementationOnce(async () => ({
        results: servicesWithAuth,
      }));

    const startingFromCursor = encodePageCursor({ page: 1 });

    const result = await authorizedSearchEngine.query(
      { term: '', pageCursor: startingFromCursor },
      options,
    );
    expect(mockedQuery).toHaveBeenCalledTimes(3);
    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,
      { term: '', types: ['users', 'templates'] },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,
      { term: '', types: ['users', 'templates'], pageCursor: 'MQ==' },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      3,
      { term: '', types: ['users', 'templates'], pageCursor: 'Mg==' },
      { token: 'token' },
    );

    expect(result).toEqual({
      results: servicesWithAuth.slice(5),
      previousPageCursor: encodePageCursor({ page: 0 }),
    });
  });
});

describe('decodePageCursor', () => {
  it('should correctly decode the cursor', () => {
    expect(decodePageCursor()).toEqual({ page: 0 });
    expect(decodePageCursor(encodePageCursor({ page: 1 }))).toEqual({
      page: 1,
    });
    expect(decodePageCursor('Mg==')).toEqual({
      page: 2,
    });
    expect(decodePageCursor(encodePageCursor({ page: 0 }))).toEqual({
      page: 0,
    });
    expect(decodePageCursor(encodePageCursor({ page: 100 }))).toEqual({
      page: 100,
    });
  });

  it('should throw an error if the cursor is not valid', () => {
    expect(() => decodePageCursor(encodePageCursor({ page: -100 }))).toThrow();
    expect(() => decodePageCursor('something')).toThrow();
  });
});
