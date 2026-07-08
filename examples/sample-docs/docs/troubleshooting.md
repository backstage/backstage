# Troubleshooting

Common issues while testing TechDocs and the TechDocs editor plugin.

## "Edit" button is missing

Possible causes:

- The entity uses `backstage.io/techdocs-ref: dir:.` instead of a `url:` reference
- TechDocs editor plugin is not enabled in the app
- You are not signed in with a provider supported by the editor backend

## Commit fails with permission error

Check:

- GitHub token is set in `app-config.local.yaml`
- Token has repository write access
- The repository is reachable from this Backstage instance

## TechDocs page does not render

Check:

- `mkdocs.yml` exists and includes `techdocs-core`
- Referenced markdown files exist under `docs/`
- Backend logs for TechDocs builder errors

## Quick validation commands

```bash
# Ensure repository dependencies are installed
yarn install

# Type check
yarn tsc
```
