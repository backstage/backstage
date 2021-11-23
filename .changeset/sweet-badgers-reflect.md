---
'@backstage/config-loader': minor
---

Added provision so that $file and $include can use a url (i.e. if the value starts with http:// or https://)

These changes are **required** to packages/config-loader/src/lib/index.ts

```diff
@@ -17,4 +17,4 @@
 export { readEnvConfig } from './env';
 export * from './transform';
 export * from './schema';
-export { isValidUrl } from './urls';
+export * from './urls';
```

These changes are **required** to packages/config-loader/src/lib/transform/include.ts

```diff
@@ -15,10 +15,11 @@
  */
 
 import yaml from 'yaml';
-import { extname, dirname, resolve as resolvePath } from 'path';
+import { extname, dirname, resolve as resolvePath, join as joinPath } from 'path';
 import { JsonObject, JsonValue } from '@backstage/types';
 import { isObject } from './utils';
 import { TransformFunc, EnvFunc, ReadFileFunc } from './types';
+import { validUrlResult } from '../urls';
 
 // Parsers for each type of included file
 const includeFileParser: {
@@ -72,7 +73,7 @@ export function createIncludeTransform(
     switch (includeKey) {
       case '$file':
         try {
-          const value = await readFile(resolvePath(baseDir, includeValue));
+          const { content: value } : { content: string } = await readValue(includeValue, readFile, includeValue , baseDir);
           return { applied: true, value };
         } catch (error) {
           throw new Error(`failed to read file ${includeValue}, ${error}`);
@@ -95,10 +96,9 @@ export function createIncludeTransform(
           );
         }
 
-        const path = resolvePath(baseDir, filePath);
-        const content = await readFile(path);
-        const newBaseDir = dirname(path);
+        const { path, content } : { path: string, content: string } = await readValue(includeValue, readFile, filePath, baseDir);
 
+        const newBaseDir = dirname(path);
         const parts = dataPath ? dataPath.split('.') : [];
 
         let value: JsonValue | undefined;
@@ -133,3 +133,24 @@ export function createIncludeTransform(
     }
   };
 }
+async function readValue(includeValue: string, readFile: ReadFileFunc, filePath: string, baseDir: string): Promise<{ path: string, content: string }> {
+  let content;
+  let path;
+  let urlValue = validUrlResult(includeValue);
+  if (urlValue) {
+    content = await readFile(urlValue, true);
+    path = filePath;
+  } else {
+    const baseUrlValue = validUrlResult(baseDir);
+    if(baseUrlValue) { // Base is a url
+      path = `${baseUrlValue.origin}${joinPath(baseUrlValue.pathname, filePath)}`;
+      urlValue = new URL(path);
+      content = await readFile(urlValue, true);
+    } else {
+      path = resolvePath(baseDir, filePath);
+      content = await readFile(path);
+    }
+  }
+  return { path, content };
+}
+
```

These changes are **required** to packages/config-loader/src/lib/transform/types.ts

```diff
@@ -18,7 +18,7 @@ import { JsonValue } from '@backstage/types';
 
 export type EnvFunc = (name: string) => Promise<string | undefined>;
 
-export type ReadFileFunc = (path: string) => Promise<string>;
+export type ReadFileFunc = (path: string | URL, isUrl?: boolean) => Promise<string>;
 
 export type TransformFunc = (
   value: JsonValue,
```

These changes are **required** to packages/config-loader/src/lib/urls.test.ts

```diff
@@ -14,7 +14,7 @@
  * limitations under the License.
  */
 
-import { isValidUrl } from './urls';
+import { isValidUrl, validUrlResult } from './urls';
 
 describe('isValidUrl', () => {
   it('should return true for url', () => {
@@ -32,3 +32,26 @@ describe('isValidUrl', () => {
     expect(validUrl).toBe(false);
   });
 });
+
+
+describe('validUrlResult', () => {
+  it('should return url value for url', () => {
+    let url = validUrlResult('http://some.valid.url');
+    expect(url).not.toBeNull();
+    url = url as URL;
+    
+    const expected = new URL('http://some.valid.url');
+    expect(url).toEqual(expected);
+    expect(url.href).toBe(expected.href);
+  });
+
+  it('should return null for absolute path', () => {
+    const validUrl = validUrlResult('/some/absolute/path');
+    expect(validUrl).toBe(null);
+  });
+
+  it('should return null for relative path', () => {
+    const validUrl = validUrlResult('../some/relative/path');
+    expect(validUrl).toBe(null);
+  });
+});
```

These changes are **required** to packages/config-loader/src/lib/urls.ts

```diff
@@ -15,11 +15,14 @@
  */
 
 export function isValidUrl(url: string): boolean {
+  return validUrlResult(url) ? true : false;
+}
+
+export function validUrlResult(url: string): URL | null {
   try {
     // eslint-disable-next-line no-new
-    new URL(url);
-    return true;
+    return new URL(url);
   } catch {
-    return false;
+    return null;
   }
 }
```

These changes are **required** to packages/config-loader/src/loader.test.ts

```diff
@@ -53,6 +53,58 @@ describe('loadConfig', () => {
     },
   );
 
+  const includeHandler = rest.get(
+    `https://some.domain.io/include.yaml`,
+    (_req, res, ctx) => {
+      return res(
+        ctx.body(
+          `included:
+                    title: Hello from Include
+                    includeValue: 'inc123'
+                    escaped: \$\${Escaped}
+                  `,
+        ),
+      );
+    },
+  );
+
+  const fileHandler = rest.get(
+    `https://some.domain.io/file.yaml`,
+    (_req, res, ctx) => {
+      return res(
+        ctx.body(`Extension doesn't matter here`),
+      );
+    },
+  );
+
+  const include2Handler = rest.get(
+    `https://some.domain.io/include2.yaml`,
+    (_req, res, ctx) => {
+      return res(
+        ctx.body(
+          `included:
+                    title: Hello from Include2
+                    subInclude: 
+                      $include: sub-include.yaml
+                  `,
+        ),
+      );
+    },
+  );
+
+  const subIncludeHandler = rest.get(
+    `https://some.domain.io/sub-include.yaml`,
+    (_req, res, ctx) => {
+      return res(
+        ctx.body(
+          `subIncluded:
+                    title: Hello from Sub Include
+                  `,
+        ),
+      );
+    },
+  );
+
   beforeAll(() => server.listen());
 
   beforeEach(() => {
@@ -104,6 +156,18 @@ describe('loadConfig', () => {
       `,
       '/root/secrets/substituted.txt': '123abc',
       '/root/${ESCAPE_ME}.txt': 'notSubstituted',
+      '/root/app-config.substitute2.yaml': `
+        app:
+          someConfig:
+            $include: https://some.domain.io/include.yaml
+          noSubstitute:
+            $file: https://some.domain.io/file.yaml
+      `,
+      '/root/app-config.substitute3.yaml': `
+        app:
+          someConfig:
+            $include: https://some.domain.io/include2.yaml
+      `,
     });
   });
 
@@ -295,6 +359,70 @@ describe('loadConfig', () => {
     });
   });
 
+  it('loads substituted config via url', async () => {
+    server.use(includeHandler, fileHandler);
+
+    await expect(
+      loadConfig({
+        configRoot: '/root',
+        configPaths: [],
+        configTargets: [{ path: '/root/app-config.substitute2.yaml' }],
+        env: 'development',
+      }),
+    ).resolves.toEqual({
+      appConfigs: [
+        {
+          context: 'app-config.substitute2.yaml',
+          data: {
+            app: {
+              someConfig: {
+                included: {
+                    title: 'Hello from Include',
+                    includeValue: 'inc123',
+                    escaped: '${Escaped}'
+                }
+              },
+              noSubstitute: 'Extension doesn\'t matter here',
+            },
+          },
+        },
+      ],
+    });
+  });
+
+  it('loads deep substituted config via url', async () => {
+    server.use(include2Handler, subIncludeHandler);
+
+    await expect(
+      loadConfig({
+        configRoot: '/root',
+        configPaths: [],
+        configTargets: [{ path: '/root/app-config.substitute3.yaml' }],
+        env: 'development',
+      }),
+    ).resolves.toEqual({
+      appConfigs: [
+        {
+          context: 'app-config.substitute3.yaml',
+          data: {
+            app: {
+              someConfig: {
+                included: {
+                  subInclude: {
+                    subIncluded: {
+                      title: 'Hello from Sub Include'
+                    }
+                  },
+                  title: "Hello from Include2"
+                },
+              }
+            },
+          },
+        },
+      ],
+    });
+  });
+
   it('watches config files', async () => {
     const onChange = defer<AppConfig[]>();
     const stopSignal = defer<void>();
```

These changes are **required** to packages/config-loader/src/loader.ts

```diff
@@ -99,6 +99,21 @@ export type LoadConfigResult = {
   appConfigs: AppConfig[];
 };
 
+
+/**
+ * 
+ * @param Reads config from url and returns back the text
+ * @returns 
+ */
+async function readConfigFromUrl(url: string): Promise<string> {
+  const response = await fetch(url);
+  if (!response.ok) {
+    throw new Error(`Could not read config file at ${url}`);
+  }
+
+  return await response.text();
+};
+
 /**
  * Load configuration data.
  *
@@ -152,8 +167,7 @@ export async function loadConfig(
       }
 
       const dir = dirname(configPath);
-      const readFile = (path: string) =>
-        fs.readFile(resolvePath(dir, path), 'utf8');
+      const readFile = readFileHelper(dir);
 
       const input = yaml.parse(await readFile(configPath));
       const substitutionTransform = createSubstitutionTransform(env);
@@ -171,15 +185,6 @@ export async function loadConfig(
   const loadRemoteConfigFiles = async () => {
     const configs: AppConfig[] = [];
 
-    const readConfigFromUrl = async (url: string) => {
-      const response = await fetch(url);
-      if (!response.ok) {
-        throw new Error(`Could not read config file at ${url}`);
-      }
-
-      return await response.text();
-    };
-
     for (let i = 0; i < configUrls.length; i++) {
       const configUrl = configUrls[i];
       if (!isValidUrl(configUrl)) {
@@ -307,3 +312,26 @@ export async function loadConfig(
       : [...fileConfigs, ...envConfigs],
   };
 }
+
+/**
+ * 
+ * @param dir 
+ * @returns 
+ */
+function readFileHelper(dir: string) {
+  return (pathOrUrl: string | URL, isUrl: boolean) => {
+    if(isUrl) {
+      const url: URL = pathOrUrl as URL;
+      if (url) { // protocol!
+        if (url.protocol === 'file:') {
+          // eslint-disable-next-line no-param-reassign
+          pathOrUrl = url.pathname; // Read as a regular file
+        } else {
+          return readConfigFromUrl(url.href);
+        }
+      }
+    }
+    return fs.readFile(resolvePath(dir, pathOrUrl as string), 'utf8')
+  }
+}
+
```

