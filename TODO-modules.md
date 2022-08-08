# Module Support

TODO: Check if type: module works for asset-types

## Plan of attack

1. [ ] Make "Node16" TS module modes work in main repo
       a. [ ] Replace ts-node register with something that works
       b. [ ] Contribute fixes for invalid "exports" field in dependencies
       c. [ ] Fix dynamic imports in FE code
       d. [ ] Fix dynamic imports in BE code (?)
       e. [ ] Jest
2. [ ] Migrate main repo to use "exports", with fallback, use duplicate type definitions if needed
3. [ ] Enhance build system to output both "exports" and package.json fallbacks
4. [ ] Migration tooling and instructions for users
5. [ ] Migrate backend tooling to modules?

## Notes

- Migrate all our packages to ESM using "exports" field and transpilation with explicit extensions, avoid "type": "module"
- Experimental type build needs "exports" field to work around sub-path package.json breakage
- Maybe migrate code to use `.mts`?
- Contribute fixes to upstream packages
  - Some packages don't have "exports" field properly filled in, it needs types.
  - The package.json-based sub-path exports break with ESM modules, some packages need "exports" fields added for compatibility.
  - Setting "type": "module" can potentially prevent imports, maybe ask upstream to use explicit paths instead?
- Should we set "type": "module" or use explicit extensions? Needs investigation
  - Setting type may break imports and be bad for compatibility, especially during migration
  - Not setting type potentially makes the migration harder or more tedious, as you don't get proper compile-time checks or have to switch to `.mts`
- Possibly move CLI back to use require rather than import? sucks because no types. May need to migrate to ESM instead.
- Backend system should support ESM natively in the build system, needs figuring out
- Move .eslintrc.js to .eslintrc.cjs

## Resources

- [Webpack docs, great intro do the "exports" syntax](https://webpack.js.org/guides/package-exports/)
- [TypeScript 4.7 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#package-json-exports-imports-and-self-referencing)
- [Explanation of why duplicate type definitions might be needed](https://github.com/rollup/plugins/issues/1192)
- [Jest package exports](https://github.com/facebook/jest/issues/9771)

## TypeScript Errors

```
Cannot find module 'helmet/dist/types/middlewares/content-security-policy' or its corresponding type declarations.
Cannot find module 'jose/dist/types/types' or its corresponding type declarations.
Cannot find module 'msw/node' or its corresponding type declarations.

Could not find a declaration file for module '@apollo/explorer/react'. '/Users/patriko/dev/backstage/node_modules/@apollo/explorer/react/index.cjs' implicitly has an 'any' type.
Could not find a declaration file for module '@codemirror/language'. '/Users/patriko/dev/backstage/node_modules/@codemirror/language/dist/index.cjs' implicitly has an 'any' type.
Could not find a declaration file for module '@codemirror/legacy-modes/mode/yaml'. '/Users/patriko/dev/backstage/node_modules/@codemirror/legacy-modes/mode/yaml.cjs' implicitly has an 'any' type.
Could not find a declaration file for module '@codemirror/view'. '/Users/patriko/dev/backstage/node_modules/@codemirror/view/dist/index.cjs' implicitly has an 'any' type.
Could not find a declaration file for module '@rollup/plugin-commonjs'. '/Users/patriko/dev/backstage/node_modules/@rollup/plugin-commonjs/dist/cjs/index.js' implicitly has an 'any' type.
Could not find a declaration file for module '@rollup/plugin-node-resolve'. '/Users/patriko/dev/backstage/node_modules/@rollup/plugin-node-resolve/dist/cjs/index.js' implicitly has an 'any' type.
Could not find a declaration file for module '@testing-library/user-event'. '/Users/patriko/dev/backstage/node_modules/@testing-library/user-event/dist/index.cjs' implicitly has an 'any' type.
Could not find a declaration file for module 'rollup-plugin-dts'. '/Users/patriko/dev/backstage/node_modules/rollup-plugin-dts/dist/rollup-plugin-dts.cjs' implicitly has an 'any' type.

Module '@apollo/explorer/src/helpers/types' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'already' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'ansi-regex' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'helmet' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'isomorphic-git' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'isomorphic-git/http/node' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'p-limit' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'react-markdown' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'remark-gfm' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.
Module 'yn' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.

Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Consider adding an extension to the import path.
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './AsyncApiDefinition.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './GitReleaseManager.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './GraphQlDefinition.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './OpenApiDefinition.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './RealLogViewer.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './Router.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './Shortcuts.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/EntityBadgesDialog.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/EntitySplunkOnCallCard.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/GithubDeploymentsCard.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/NewRelicDashboard/DashboardEntityList.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/NewRelicDashboard/DashboardSnapshotList/DashboardSnapshot.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/RadarPage.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/Router.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/SettingsPage.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './components/SplunkOnCallPage.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './entity-page.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './generate/generate.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './home/components/TechDocsCustomHome.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './home/components/TechDocsIndexPage.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './migrate/migrate.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './publish/publish.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './serve/mkdocs.js'?
Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './serve/serve.js'?
```
