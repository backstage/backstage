# Getting Started

## Prerequisites

- Node.js 18+
- Yarn 4+
- Docker (for local TechDocs generation)

## Installation

```bash
# Clone the repository
git clone https://github.com/Estehsan/backstage.git
cd backstage

# Install dependencies
yarn install

# Start the dev server (frontend :3000, backend :7007)
yarn start
```

## Local configuration

Create `app-config.local.yaml` at the project root and fill in your credentials:

```yaml
integrations:
  github:
    - host: github.com
      token: YOUR_GITHUB_TOKEN

auth:
  providers:
    github:
      development:
        clientId: YOUR_CLIENT_ID
        clientSecret: YOUR_CLIENT_SECRET
```

## Running tests

```bash
# Run a single test file
CI=1 yarn test packages/backend/src/index.test.ts

# Type-check the whole repo
yarn tsc
```

## Test flows: TechDocs, Editor, and Import

Use these quick paths in the app sidebar:

- **TechDocs (All Documents)**: `/docs?filters[user]=all`
- **Catalog (All)**: `/catalog?filters[user]=all`
- **Catalog Import**: `/catalog-import`

### 1) TechDocs (render)

Open **TechDocs (All Documents)** and confirm this sample renders all pages from `mkdocs.yml`.

### 2) TechDocs Editor (edit + commit)

Open **Editor Playground** and click **Edit**. Make a small change and commit it as a draft PR.

### 3) Catalog Import (register a documented entity)

Go to **Catalog Import** and import an entity that has `backstage.io/techdocs-ref` configured.

Example URL to try:

`https://github.com/Estehsan/test-techdoc/blob/main/catalog-info.yaml`
