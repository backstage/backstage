---
'@backstage/backend-common': minor
---

Remove fallback option from `UrlReaders.create` and `UrlReaders.default`, as well as the default fallback reader.

To be able to read data from endpoints outside of the configured integrations, you now need to explicitly allow it by
adding an entry in the `backend.reading.allow` list. For example:

```yml
backend:
  baseUrl: ...
  reading:
    allow:
      - host: example.com
      - host: '*.examples.org'
```

Apart from adding the above configuration, most projects should not need to take any action to migrate existing code. If you do happen to have your own fallback reader configured, this needs to be replaced with a reader factory that selects a specific set of URLs to work with. If you where wrapping the existing fallback reader, the new one that handles the allow list is created using `FetchUrlReader.factory`.
