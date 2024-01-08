---
'@backstage/plugin-catalog-backend': patch
---

Change script in **UrlReaderProcessor.ts** adding some code to handle URL Reader from GCS with wildcard \*

```diff
  private async doRead(
    location: string,
    etag?: string,
  ): Promise<{ response: { data: Buffer; url: string }[]; etag?: string }> {
    // Does it contain globs? I.e. does it contain asterisks or question marks
    // (no curly braces for now)
    // This part of the code filters the URL that includes GCS url
+    const getUrlReaderGCs = location.includes('storage.cloud.google.com');
+    if (getUrlReaderGCs) {
+      const limiter = limiterFactory(50);
+      const getGoogleCloudStorage = await this.options.reader.search(location);
+      const output = getGoogleCloudStorage.files.map(async file => ({
+        url: file.url,
+        data: await limiter(file.content),
+      }));
+      return {
+        response: await Promise.all(output),
+        etag: getGoogleCloudStorage.etag,
+      };
+    }

    const { filepath } = parseGitUrl(location);
    if (filepath?.match(/[*?]/)) {
      const limiter = limiterFactory(5);
      const response = await this.options.reader.search(location, { etag });
      const output = response.files.map(async file => ({
        url: file.url,
        data: await limiter(file.content),
      }));
      return { response: await Promise.all(output), etag: response.etag };
    }

    const data = await this.options.reader.readUrl(location, { etag });
    return {
      response: [{ url: location, data: await data.buffer() }],
      etag: data.etag,
    };
  }
```
