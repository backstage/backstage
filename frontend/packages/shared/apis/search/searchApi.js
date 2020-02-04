import { graphqlRequest } from 'shared/apis/backstage/graphqlClient';
import gql from 'graphql-tag';

const defaultExtraFields = `
  ... on Component {
    description
    lifecycle
    owner {
      id
      name
      type
    }
  }
  ... on TechDoc {
    componentId
    location
    title
    text
    hitsLast30Days
  }
  ... on Dataset {
    lifecycle
    sysmodelComponentId
    storageType
    isGolden
    dataFormat
    publishFrequency
    accessPolicy
    tc4dLevel
    description
    isTestRun
    owner {
      id
      name
      type
    }
  }
  ... on Workflow {
    lifecycle
    owner {
      id
      name
      type
    }
  }
  ... on GoogleCloudPlatformProject {
    owner {
      id
      name
      type
    }
  }
  ... on MLProject {
    name
    description
  }`;

export function esSearch(filter, options = {}) {
  const { extraFields = defaultExtraFields } = options;

  const query = gql`
    query ElasticSearch($query: String!) {
      elasticSearch(esQuery: $query) {
        data {
          __typename
          ... on Indexable {
            id
            componentType
          }
          ${extraFields}
        }
        aggregations {
          name
          buckets {
            key
            docCount
          }
        }
      }
    }
  `;

  return graphqlRequest(query, {
    query: filter.query,
  });
}

export default { esSearch };
