import { constructDefaultQuery } from './ESQueryBuilder';
import axios from 'axios';
import { urls } from 'shared/apis/baseUrls';

async function doEsQuery(term) {
  const query = constructDefaultQuery(term);
  const esQuery = `
      query ElasticSearch($query: String!) {
        elasticSearch(esQuery: $query) {
          data {
            ... on Indexable {
              id
              componentType
            }
          }
        }
      }
    `;

  let error;
  for (let attempts = 0; attempts < 3; attempts++) {
    try {
      const res = await axios.post(`${urls.proxy}/api/backend/graphql`, {
        operationName: 'ElasticSearch',
        query: esQuery,
        variables: {
          query: JSON.stringify(query.build()),
        },
      });

      return res.data.data.elasticSearch.data;
    } catch (e) {
      error = e;
    }
  }
  throw error;
}

describe('ESQueryBuilder', () => {
  // TODO: Too flaky, move to script / external service
  it.skip.each([
    'sysmodel',
    'backstage-lb',
    'backstage-backend',
    'backstage-frontend',
    'backstage-e2e-test-data',
    'backstage-e2e-test-data.TestData',
  ])('find exact match for term - %s', async queryTerm => {
    const result = await doEsQuery(queryTerm);
    expect(result[0].id).toBe(queryTerm);
  });
});
