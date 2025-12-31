# RSPress Migration POC - Findings

## ✅ What Works

### 1. Basic Documentation
- ✅ Existing Backstage docs load successfully
- ✅ Build time: **2.11 seconds** (very fast!)
- ✅ MDX support with Rust compiler
- ✅ Image paths work with `preferRelative` config

### 2. Multi-Version Support
- ✅ RSPress has built-in versioning
- ⚠️ Requires reorganizing docs into version folders (`docs/stable/`, `docs/next/`)
- Configuration ready (commented in `rspress.config.ts`)

### 3. Blog
- ⚠️ No built-in blog support
- ✅ Created POC using data loading API (see `docs/blog.mdx` and `blog.data.ts`)
- ❌ Missing features:
  - RSS feed generation
  - Pagination
  - Categories/tags
  - Author management
  - SEO metadata per post

## ❌ What Doesn't Work / Needs Custom Implementation

### 1. OpenAPI Documentation
- ❌ No RSPress plugin exists for OpenAPI docs
- Current Docusaurus setup uses `docusaurus-plugin-openapi-docs` for:
  - `/docs/features/software-catalog/api` (catalog-backend OpenAPI spec)
  - `/docs/features/search/api` (search-backend OpenAPI spec)
  - `/docs/features/software-templates/api` (scaffolder-backend OpenAPI spec)

**Options:**
1. Generate static markdown from OpenAPI specs using tools like `redocly` or `openapi-generator`
2. Embed Swagger UI/Redoc as iframes
3. Build a custom RSPress plugin for OpenAPI
4. Use a separate documentation site for API docs

### 2. Search
- ✅ RSPress has built-in full-text search
- ⚠️ Algolia DocSearch integration possible but requires configuration
- Current Docusaurus uses Algolia with custom index

### 3. Custom React Components
- ⚠️ Microsite has custom React components in `src/components/`
- These would need testing/adaptation for RSPress

### 4. Docusaurus-Specific Features Used
- Client redirects (`@docusaurus/plugin-client-redirects`)
- PushFeedback widget (`docusaurus-pushfeedback`)
- SASS support (`docusaurus-plugin-sass`)
- Custom webpack configuration
- Custom scripts (pre-build.js)

## Build Performance Comparison

| Tool | Dev Build | Production Build | Speed Improvement |
|------|-----------|------------------|-------------------|
| **RSPress** | 2.1s | **21.3s** | **7x faster** |
| **Docusaurus** | N/A | 151s (2m 31s) | baseline |

The performance difference is dramatic - RSPress builds are **7 times faster** than Docusaurus.

## Migration Effort Estimate

| Feature | Complexity | Effort |
|---------|-----------|--------|
| Basic docs | Low | Already working |
| Versioning | Medium | Reorganize folder structure |
| Blog | High | Build custom implementation (2-3 days) |
| OpenAPI docs | High | Choose & implement solution (3-5 days) |
| Search (Algolia) | Medium | Configuration & testing (1 day) |
| Custom components | Medium | Test & adapt (1-2 days) |
| Redirects | Low | Map to RSPress redirects (few hours) |
| Styling/theming | Medium | Recreate custom theme (1-2 days) |

**Total estimate: 2-3 weeks of focused development work**

## Recommendation

RSPress delivers on **performance** but requires **significant custom development** for:
1. Blog functionality (no plugin available)
2. OpenAPI documentation (no plugin available)

If build performance is the primary concern, consider:
1. Optimize current Docusaurus setup first
2. Investigate if RSPress blog/OpenAPI plugins are in development
3. Accept reduced features for performance gains
4. Hybrid approach: RSPress for docs, separate blog system
