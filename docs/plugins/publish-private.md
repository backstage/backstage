---
id: publish-private
title: Publish private
description: Documentation on How to Publish private
---

## To Publish Plugin to Private Registry

### Step 1: Create or Update `.npmrc` File

Create or update the `.npmrc` file in your project root with the private registry URL. If a `.npmrc` file also exists in your user home directory, the project-level file will take precedence.

```sh
registry=https://your-private-registry-url/
```

### Step 2: Add Authentication (if required)

If your private registry requires authentication, add the authentication token to your `.npmrc` file. This token can usually be obtained from your registry's user interface or API.

```sh
//your-private-registry-url/:_authToken=YOUR_AUTH_TOKEN
```

### Step 3: Modify `package.json`

Ensure the `package.json` file does not have `"private": true`. Either set it to `false` or remove it. Also, make sure to increment the `"version"` field following the [semantic versioning](https://semver.org/) rules each time you publish.

The `"name"` field in your `package.json` should adhere to your registry's naming conventions. Ensure the name is unique within your private registry and follows any required naming guidelines.

### Step 4: Build Your Project (if necessary)

If your project needs to be built (e.g., TypeScript compilation, bundling JavaScript), run the appropriate build commands. The specific commands depend on your project setup.

```sh
yarn tsc  # Run TypeScript compilation (if necessary)
yarn build
```

### Step 5: Publish Your Package

Publish your package to the private registry:

```sh
yarn publish --registry https://your-private-registry-url/
```
