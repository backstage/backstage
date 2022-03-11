---
'@backstage/create-app': patch
---

The main repo has switched from `@vscode/sqlite3` to `better-sqlite3` as its preferred SQLite installation. This decision was triggered by a number of issues with the former that arose because it needs build infrastructure in place and functional in order to be installed. The main drawback of this is that the new package uses the database client ID `better-sqlite3` instead of the plain `sqlite3`.

If you want to perform the same switch in your own repository,

- Replace all of your `package.json` dependencies on `@vscode/sqlite3` with the latest version of `better-sqlite3` instead

  ```diff
   "dependencies": {
  -  "@vscode/sqlite3": "^5.0.7",
  +  "better-sqlite3": "^7.5.0",
  ```

- In your app-config and tests, wherever you supply `client: 'sqlite3'`, instead supply `client: 'better-sqlite3`

  ```diff
    backend:
      database:
  -    client: sqlite3
  +    client: better-sqlite3
  ```
