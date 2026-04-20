# Adding TechDocs to Your Repo

Any repository discovered by the Blitzy Sandbox portal can serve its own documentation through TechDocs. Here's how to set it up.

## Requirements

Your repository needs two things:

1. A `backstage.io/techdocs-ref` annotation in `catalog-info.yaml`
2. An `mkdocs.yml` file at the referenced location

## Step 1: Add the annotation

In your repository's `catalog-info.yaml`, add the TechDocs annotation:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-blitzy-project
  annotations:
    backstage.io/techdocs-ref: dir:.
spec:
  type: library
  owner: blitzy-sandbox
  lifecycle: production
```

The `dir:.` value means the `mkdocs.yml` is at the repository root.

## Step 2: Create mkdocs.yml

Add an `mkdocs.yml` at the root of your repository:

```yaml
site_name: 'My Blitzy Project'
plugins:
  - techdocs-core

nav:
  - Home: 'index.md'
  - Usage: 'usage.md'
  - API Reference: 'api.md'
```

## Step 3: Add documentation files

Create a `docs/` directory with your markdown files:

```
my-repo/
├── catalog-info.yaml
├── mkdocs.yml
└── docs/
    ├── index.md
    ├── usage.md
    └── api.md
```

## Step 4: Verify

After the next catalog refresh (or manually triggering a refresh), navigate to your component in the portal and click the **Docs** tab. The documentation will be built on first access.

## Tips

- Use Mermaid diagrams with fenced code blocks (` ```mermaid `) — they render automatically
- Keep docs focused: 5-10 pages is ideal for a project overview
- Images should be placed in `docs/` and referenced with relative paths
