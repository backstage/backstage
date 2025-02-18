# search-backend-module-pg

This plugin provides an easy to use `SearchEngine` implementation to use with the
`@backstage/plugin-search-backend` based on Postgres.
Therefore it targets setups that want to avoid maintaining another external
service like elastic search. The search provides decent results and performs
well with ten thousands of indexed documents.
The connection to postgres is established via the database manager also used by
other plugins.

> **Important**: The search plugin requires at least Postgres 12!

## Getting started

See [Backstage documentation](https://backstage.io/docs/features/search/search-engines#postgres)
for details on how to setup Postgres based search for your Backstage instance.

## Optional Configuration

The following is an example of the optional configuration that can be applied when using Postgres as the search backend.

```yaml
search:
  pg:
    highlightOptions:
      useHighlight: true # Used to enable to disable the highlight feature. The default value is true
      maxWord: 35 # Used to set the longest headlines to output. The default value is 35.
      minWord: 15 # Used to set the shortest headlines to output. The default value is 15.
      shortWord: 3 # Words of this length or less will be dropped at the start and end of a headline, unless they are query terms. The default value of three (3) eliminates common English articles.
      highlightAll: false # If true the whole document will be used as the headline, ignoring the preceding three parameters. The default is false.
      maxFragments: 0 # Maximum number of text fragments to display. The default value of zero selects a non-fragment-based headline generation method. A value greater than zero selects fragment-based headline generation (see the linked documentation above for more details).
      fragmentDelimiter: ' ... ' # Delimiter string used to concatenate fragments. Defaults to " ... ".
    normalization: 0 # Ranking functions use an integer bit mask to control document length impact on rank. The default value is 0
```

The Normalization option controls several behaviors. It is a bit mask. [Ranking Search Results](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING) has more details.

Example with bit mask specifying more behaviours:

- 2 divides the rank by the document length
- 4 divides the rank by the mean harmonic distance between extents

```yaml
search:
  pg:
    normalization: 2 | 4
```

**Note:** the highlight search term feature uses `ts_headline` which has been known to potentially impact performance. You only need this minimal config to disable it should you have issues:

```yaml
search:
  pg:
    highlightOptions:
      useHighlight: false
```

The Postgres documentation on [Highlighting Results](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-HEADLINE) has more details.
