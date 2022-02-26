---
'@backstage/plugin-search-backend-node': minor
'@backstage/search-common': minor
---

The Backstage Search Platform's indexing process has been rewritten as a stream
pipeline in order to improve efficiency and performance on large document sets.

The concepts of `Collator` and `Decorator` have been replaced with readable and
transform object streams (respectively), as well as factory classes to
instantiate them.

Accordingly, the `SearchEngine.index()` method has also been replaced with a
`getIndexer()` factory method that resolves to a writable object stream.
