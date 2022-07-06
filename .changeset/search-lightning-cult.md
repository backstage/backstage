---
'@backstage/plugin-search-backend-module-elasticsearch': minor
---

**BREAKING**: In order to remain interoperable with all currently supported
deployments of Elasticsearch, this package will now conditionally use either
the `@elastic/elasticsearch` or `@opensearch-project/opensearch` client when
communicating with your deployed cluster.

If you do not rely on types exported from this package, or if you do not make
use of the `createElasticSearchClientOptions` or `newClient` methods on the
`ElasticSearchSearchEngine` class, then upgrading to this version should not
require any further action on your part. Everything will continue to work as it
always has.

If you _do_ rely on either of the above methods or any underlying types, some
changes may be needed to your custom code. A type guard is now exported by this
package (`isOpenSearchCompatible(options)`), which you may use to help clarify
which client options are compatible with which client constructors.

If you are using this package with the `search.elasticsearch.provider` set to
`aws`, and you are making use of the `newClient` method in particular, you may
wish to start using the `@opensearch-project/opensearch` client in your custom
code.
