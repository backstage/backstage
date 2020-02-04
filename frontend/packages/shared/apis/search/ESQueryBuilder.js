import bodybuilder from 'bodybuilder';
import { pruneFilterObject } from 'plugins/searchPage/components/FacetsFilter';

export const DEFAULT_PAGE_SIZE = 30;
const COMPONENT_TYPE_AGG_SIZE = 100;
const AGG_SIZE = 300;

const getFieldWithDataType = name =>
  ['tc4dLevel', 'isGolden', 'isTestRun'].indexOf(name) > -1 ? name : `${name}.keyword`;

const applyFilters = (query, filters = {}) => {
  Object.keys(filters).forEach(filterSetId => {
    const filterValues = Object.keys(filters[filterSetId]);
    if (filterValues.length) {
      query.filter('terms', getFieldWithDataType(filterSetId), filterValues);
      if (filterValues.options) {
        applyFilters(query, filterValues.options);
      }
    }
  });
  return query;
};

export const createFilteredQuery = (filters = {}) => {
  const search = bodybuilder();

  if (Object.keys(filters).length) {
    search.aggregation('filter', 'componentType.keyword', a => {
      applyFilters(a, filters);
      a.aggregation('terms', 'componentType.keyword', { size: COMPONENT_TYPE_AGG_SIZE }, 'metadata');
      return a;
    });
  } else {
    search.aggregation('terms', 'componentType.keyword', { size: COMPONENT_TYPE_AGG_SIZE }, 'metadata');
  }

  return search;
};

export const constructDefaultQuery = (term, filters = {}) => {
  const search = createFilteredQuery(filters);

  if (!term) {
    return search.query('match_all');
  }

  return (
    search
      .query('multi_match', {
        query: term,
        fields: ['_all', 'id^2', 'id.raw^100', 'id.ngram_raw^2', 'tags.raw^5', 'tags.ngram_raw^2'],
      })
      .orQuery('match', 'lifecycle', { query: 'production', boost: 3 })
      .orQuery('match', 'tc4dLevel', { query: '3', boost: 4 })
      .orQuery('match', 'tc4dLevel', { query: '2', boost: 3 })
      .orQuery('match', 'tc4dLevel', { query: '1', boost: 2 })
      .orQuery('match', 'isGolden', { query: 'true', boost: 1 })
      .orQuery('match', 'resourceId', { query: term, boost: 1 })
      .notFilter('term', 'componentType.keyword', 'data-endpoint')
      // The index boost for search-partnership must be wildcarded, if an exact name is provided Elasticsearch throws
      // an error when the index doesn't exist (in tests, but this also seems like good safety for production).
      .rawOption('indices_boost', [{ 'search-partnershi*': 10 }])
  );
};

export const constructDocsQuery = (term, filters = {}) => {
  const search = createFilteredQuery(filters);

  if (!term) {
    return search.query('match_all');
  }

  /* If a search term includes double quotes we would like to give exact matches for that.
    For example "Find horse ever bus" should return a empty search result list.
    1. Words should be included in any docs that shows up in search result.
    2. Words should have the exact same sequence in the document as in the search term to be a valid search result.
    (as in Googles exact match search) */
  // TODO: Boosting for exact match

  if (term.match(/"[^"]*"/)) {
    return search.rawOption('query', {
      query_string: {
        query: term,
      },
    });
  }

  return search.rawOption('query', {
    function_score: {
      query: {
        multi_match: {
          query: term,
          fields: [
            '_all',
            'componentId^6',
            'text^7',
            'title^2',
            'title.ngram^1',
            'location^10',
            'id^2',
            'id.raw^100',
            'id.ngram_raw^2',
            'tags.raw^5',
            'tags.ngram_raw^2',
          ],
        },
      },
      functions: [
        {
          field_value_factor: {
            field: 'hitsLast30Days',
            factor: 1.0,
            modifier: 'sqrt',
            missing: 1,
          },
        },
      ],
      boost: '5',
      boost_mode: 'sum',
      score_mode: 'multiply',
    },
  });
};

// Construct elastic search query from term and filters
export const constructQuery = ({
  aggFields = [],
  componentType,
  filters = {},
  pagination = { pageIndex: 0, size: DEFAULT_PAGE_SIZE },
  sort = {},
  query: term = '',
}) => {
  const prunedFilters = pruneFilterObject(filters);
  const hasFilters = !!Object.keys(prunedFilters).length;
  let query;

  // TODO: get rid of this piece of tech dept, platformize search
  if (componentType === 'tech-doc') {
    query = constructDocsQuery(term, prunedFilters);
  } else {
    query = constructDefaultQuery(term, prunedFilters);
  }

  // Apply pagination
  query.from(pagination.pageIndex * Number(pagination.size)).size(Number(pagination.size));

  if (sort.column && sort.column !== 'false') {
    query.sort([
      {
        // tc4d value needs to default to 0 if it is missing for sorting to work
        [getFieldWithDataType(sort.column)]: {
          order: sort.direction,
          ...(sort.column === 'tc4dLevel' ? { missing: 0 } : {}),
        },
      },
    ]);
  }

  // Apply selected filters and component type filter as a post_filter so that aggregation counts
  // are not affected (for example, filtering on lifecycle 'production' should NOT then show that there are 0 components
  // with lifecycle 'experimental', as it would if this was not a post_filter).
  let postFilters = bodybuilder();
  if (hasFilters) {
    postFilters = applyFilters(postFilters, prunedFilters);
  }
  if (componentType) {
    postFilters.filter('term', 'componentType.keyword', componentType);
  }
  query.rawOption('post_filter', postFilters.getFilter());

  // Add aggregations for each filterable field, to get counts for the terms in that field; the aggregation should have
  // active filters applied EXCEPT its own, so that other filters affect the counts but selecting the filter doesn't
  // drop the counts for other values of the same filter to zero.
  if (aggFields.length) {
    aggFields.forEach(agg => {
      const otherFilters = Object.keys(prunedFilters).reduce((acc, key) => {
        if (key !== agg && Object.keys(prunedFilters[key]).length) {
          acc[key] = prunedFilters[key];
        }
        return acc;
      }, {});

      if (Object.keys(otherFilters).length || componentType) {
        query.aggregation('filter', getFieldWithDataType(agg), a => {
          applyFilters(a, otherFilters);
          a.filter('term', 'componentType.keyword', componentType);

          // Component type filter is standalone and NOT included in the filter object
          if (componentType) {
            a.aggregation('terms', getFieldWithDataType(agg), { size: AGG_SIZE });
          }

          return a;
        });
      } else {
        query.aggregation('terms', getFieldWithDataType(agg), { size: AGG_SIZE });
      }
    });
  }

  return JSON.stringify(query.build());
};
