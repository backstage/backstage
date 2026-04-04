# Package.json Patterns Reference

## Frontend Plugin

```json
{
  "name": "@backstage/plugin-my-plugin",
  "version": "0.1.0",
  "description": "A Backstage plugin that integrates with MyService",
  "backstage": {
    "role": "frontend-plugin",
    "pluginId": "my-plugin",
    "pluginPackages": [
      "@backstage/plugin-my-plugin",
      "@backstage/plugin-my-plugin-backend",
      "@backstage/plugin-my-plugin-common"
    ]
  },
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": "./src/index.ts",
    "./alpha": "./src/alpha/index.ts",
    "./package.json": "./package.json"
  },
  "main": "src/index.ts",
  "types": "src/index.ts",
  "license": "Apache-2.0",
  "files": [
    "dist",
    "config.d.ts"
  ],
  "configSchema": "config.d.ts",
  "scripts": {
    "build": "backstage-cli package build",
    "start": "backstage-cli package start",
    "test": "backstage-cli package test",
    "lint": "backstage-cli package lint",
    "clean": "backstage-cli package clean",
    "prepack": "backstage-cli package prepack",
    "postpack": "backstage-cli package postpack"
  },
  "dependencies": {
    "@backstage/catalog-model": "^1.0.0",
    "@backstage/core-components": "^0.14.0",
    "@backstage/core-plugin-api": "^1.9.0",
    "@backstage/plugin-catalog-react": "^1.12.0",
    "@backstage/theme": "^0.5.0",
    "@material-ui/core": "^4.12.4",
    "react-use": "^17.2.4"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0",
    "react-router-dom": "6.0.0-beta.0 || ^6.3.0"
  },
  "devDependencies": {
    "@backstage/cli": "^0.27.0",
    "@backstage/dev-utils": "^1.1.0",
    "@backstage/test-utils": "^1.6.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

## Backend Plugin

```json
{
  "name": "@backstage/plugin-my-plugin-backend",
  "version": "0.1.0",
  "description": "Backend for the my-plugin Backstage plugin",
  "backstage": {
    "role": "backend-plugin",
    "pluginId": "my-plugin",
    "pluginPackages": [
      "@backstage/plugin-my-plugin",
      "@backstage/plugin-my-plugin-backend",
      "@backstage/plugin-my-plugin-common"
    ]
  },
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": "./src/index.ts",
    "./alpha": "./src/alpha/index.ts",
    "./package.json": "./package.json"
  },
  "main": "src/index.ts",
  "types": "src/index.ts",
  "license": "Apache-2.0",
  "files": [
    "dist",
    "config.d.ts",
    "migrations/**/*.{js,d.ts}"
  ],
  "configSchema": "config.d.ts",
  "scripts": {
    "build": "backstage-cli package build",
    "start": "backstage-cli package start",
    "test": "backstage-cli package test",
    "lint": "backstage-cli package lint",
    "clean": "backstage-cli package clean",
    "prepack": "backstage-cli package prepack",
    "postpack": "backstage-cli package postpack"
  },
  "dependencies": {
    "@backstage/backend-plugin-api": "^1.0.0",
    "@backstage/config": "^1.2.0",
    "express": "^4.17.1",
    "express-promise-router": "^4.1.0",
    "knex": "^3.0.0",
    "node-fetch": "^2.6.7",
    "yn": "^4.0.0"
  },
  "devDependencies": {
    "@backstage/backend-test-utils": "^1.0.0",
    "@backstage/cli": "^0.27.0",
    "@types/express": "^4.17.6",
    "@types/supertest": "^2.0.12",
    "msw": "^1.0.0",
    "supertest": "^6.2.4"
  }
}
```

## Backend Module

```json
{
  "name": "@backstage/plugin-my-plugin-backend-module-github",
  "version": "0.1.0",
  "description": "GitHub provider module for the my-plugin backend",
  "backstage": {
    "role": "backend-plugin-module",
    "pluginId": "my-plugin",
    "pluginPackage": "@backstage/plugin-my-plugin-backend"
  },
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": "./src/index.ts",
    "./package.json": "./package.json"
  },
  "main": "src/index.ts",
  "types": "src/index.ts",
  "license": "Apache-2.0",
  "files": [
    "dist",
    "config.d.ts"
  ],
  "scripts": {
    "build": "backstage-cli package build",
    "start": "backstage-cli package start",
    "test": "backstage-cli package test",
    "lint": "backstage-cli package lint"
  },
  "dependencies": {
    "@backstage/backend-plugin-api": "^1.0.0",
    "@backstage/plugin-my-plugin-node": "^0.1.0"
  },
  "devDependencies": {
    "@backstage/backend-test-utils": "^1.0.0",
    "@backstage/cli": "^0.27.0"
  }
}
```

## Common Library

```json
{
  "name": "@backstage/plugin-my-plugin-common",
  "version": "0.1.0",
  "description": "Common types and utilities for the my-plugin plugin",
  "backstage": {
    "role": "common-library",
    "pluginId": "my-plugin",
    "pluginPackages": [
      "@backstage/plugin-my-plugin",
      "@backstage/plugin-my-plugin-backend",
      "@backstage/plugin-my-plugin-common"
    ]
  },
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": "./src/index.ts",
    "./package.json": "./package.json"
  },
  "main": "src/index.ts",
  "types": "src/index.ts",
  "license": "Apache-2.0",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "backstage-cli package build",
    "test": "backstage-cli package test",
    "lint": "backstage-cli package lint"
  },
  "dependencies": {
    "@backstage/catalog-model": "^1.0.0"
  },
  "devDependencies": {
    "@backstage/cli": "^0.27.0"
  }
}
```

## Key Rules

1. **`backstage.role`** determines how the CLI builds the package (bundling, externals, etc.)
2. **`backstage.pluginId`** must be consistent across all packages in the plugin family
3. **`backstage.pluginPackages`** lists all sibling packages for tooling discovery
4. **`backstage.pluginPackage`** (singular, modules only) points to the parent backend plugin
5. **`exports`** field controls what consumers can import — keep it minimal
6. **`configSchema`** references the TypeScript config interface file
7. **`files`** must include `dist` for published packages; include `config.d.ts` and `migrations/` as needed
8. All scripts delegate to `backstage-cli package *` commands
9. Use `peerDependencies` for React, react-dom, and react-router-dom in frontend plugins
10. For community-plugins, scope is `@backstage-community/plugin-{name}`
