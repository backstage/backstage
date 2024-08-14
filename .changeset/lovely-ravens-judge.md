---
'@backstage/backend-common': minor
---

Removed the following `Url Reader` deprecated exports:

- UrlReader: Use `UrlReaderService` from `@backstage/backend-plugin-api` instead;
- AzureUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- BitbucketUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- BitbucketCloudUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- BitbucketServerUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- GithubUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- GitlabUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- GerritUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- GiteaUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- HarnessUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- AwsS3UrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- FetchUrlReader: Import from `@backstage/backend-defaults/urlReader` instead;
- UrlReaders: Import from `@backstage/backend-defaults/urlReader` instead;
- UrlReadersOptions: Import from `@backstage/backend-defaults/urlReader` instead;
- UrlReaderPredicateTuple: Import from `@backstage/backend-defaults/urlReader` instead;
- FromReadableArrayOptions: Import from `@backstage/backend-defaults/urlReader` instead;
- ReaderFactory: Import from `@backstage/backend-defaults/urlReader` instead;
- ReadUrlOptions:Use `UrlReaderServiceReadUrlOptions` from `@backstage/backend-plugin-api` instead;
- ReadUrlResponse: Use `UrlReaderServiceReadUrlResponse` from `@backstage/backend-plugin-api` instead;
- ReadUrlResponseFactory: Import from `@backstage/backend-defaults/urlReader` instead;
- ReadUrlResponseFactoryFromStreamOptions: Import from `@backstage/backend-defaults/urlReader` instead;
- ReadTreeOptions: Use `UrlReaderServiceReadTreeOptions` from `@backstage/backend-plugin-api` instead;
- ReadTreeResponse: Use `UrlReaderServiceReadTreeResponse` from `@backstage/backend-plugin-api` instead;
- ReadTreeResponseFile: Use `UrlReaderServiceReadTreeResponseFile` from `@backstage/backend-plugin-api` instead;
- ReadTreeResponseDirOptions: Use `UrlReaderServiceReadTreeResponseDirOptions` from `@backstage/backend-plugin-api` instead;
- ReadTreeResponseFactory: Import from `@backstage/backend-defaults/urlReader` instead;
- ReadTreeResponseFactoryOptions: Import from `@backstage/backend-defaults/urlReader` instead;
- SearchOptions: Use `UrlReaderServiceSearchOptions` from `@backstage/backend-plugin-api` instead;
- SearchResponse: Use `UrlReaderServiceSearchResponse` from `@backstage/backend-plugin-api` instead;
- SearchResponseFile: Use `UrlReaderServiceSearchResponseFile` from `@backstage/backend-plugin-api` instead.
