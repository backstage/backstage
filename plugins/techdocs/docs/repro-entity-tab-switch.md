# TechDocs entity tab switch — reproduction guide

Use this guide to capture **before/after** evidence for the TechDocs entity-tab regression fix PR.

## Why `yarn start` does not repro by default

| App                                      | Entity tabs                              | Reproduces bug? |
| ---------------------------------------- | ---------------------------------------- | --------------- |
| `yarn start` (example-app)               | Catalog alpha **`EntityTabs`**           | Usually **no**  |
| `yarn start:legacy` (example-app-legacy) | Legacy **`EntityLayout` + `RoutedTabs`** | **Yes**         |
| `yarn start:techdocs-repro:example-app`  | Legacy **`RoutedTabs`** via override     | **Yes**         |

Production apps (including Beacon) use the legacy **`EntityLayout` / `RoutedTabs`** pattern with a **`/docs`** tab and `EntityTechdocsContent`. Switching tabs **fully removes** TechDocs from the page, which triggers the Backstage 1.50+ reader regressions.

## Prerequisites

From the Backstage repo root:

```bash
yarn install
yarn start:techdocs-repro
# alias for: yarn start:legacy (example-app-legacy + example-backend)
```

`yarn start:techdocs-repro` loads only **`app-config.yaml`** at the repo root.

TechDocs generation uses **`techdocs.generator.runIn: docker`** in `app-config.yaml` (upstream default). The example `documented-component` docs include PlantUML diagrams — local mode (`runIn: local`) requires both [mkdocs-techdocs-core](https://backstage.io/docs/features/techdocs/getting-started) **and** the `plantuml` CLI on your PATH; without `plantuml`, mkdocs fails with `Command mkdocs failed, exit code: 1`.

If your build logs show paths like `/Users/.../.pyenv/.../mkdocs`, you are in **local** mode regardless of intent — check that `app-config.yaml` has `runIn: docker` and **restart** the backend after changing it.

If Docker Registry Access Management blocks pulls with **HTTP 407**, either run `docker login` or set `pullImage: false` after the image is cached locally:

```bash
docker pull spotify/techdocs:v1.2.8   # once, while logged in or on an unrestricted network
```

```yaml
techdocs:
  generator:
    runIn: docker
    pullImage: false
```

Sign in as **Guest**. Wait for the catalog to load and TechDocs to build for `documented-component` (first visit may take a minute while Docker pulls `spotify/techdocs:v1.2.8`).

## Test entities

| Entity                          | URL                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| Own docs                        | http://localhost:3000/catalog/default/component/documented-component/docs                 |
| Linked docs (`techdocs-entity`) | http://localhost:3000/catalog/default/component/sample-docs-linked-entity/docs            |
| Linked docs (inner path)        | http://localhost:3000/catalog/default/component/techdocs-entity-documented-component/docs |

## Reproduction steps

1. Open **documented-component** → **Docs** tab.
2. While the progress spinner is visible (or throttled network), click **Overview** or **Dependencies**.
3. Click **Docs** again.

## Expected broken behavior (before fix)

Record any of the following:

- [ ] Infinite loading spinner on return to Docs tab
- [ ] Page scroll jumps to an arbitrary offset (~3000px)
- [ ] MkDocs icons render oversized / layout broken after remount
- [ ] `TypeError: Failed to fetch` error panel after tab switch
- [ ] Shadow DOM has 0 stylesheet links after remount (DevTools → inspect `#techdocs-shadow-root`)

## Expected fixed behavior (after fix)

- [ ] Docs tab loads normally after switching away and back
- [ ] No scroll jump on tab return
- [ ] MkDocs styling intact after remount
- [ ] No fetch error when sync was aborted on unmount

## Capturing evidence for the PR

1. **Screen recording** (30–60s): tab switch during load → broken state → (after fix) same flow working.
2. **Screenshots**: broken spinner, broken layout, fixed state.
3. **Network tab**: aborted `/api/techdocs/sync/...` request when leaving Docs tab mid-load.
4. **Optional DevTools snippet** on Docs tab after remount:

```js
document
  .querySelector('#techdocs-shadow-root')
  ?.shadowRoot?.querySelectorAll('link[rel="stylesheet"]').length;
// Before fix: often 0 after remount
```

## Which code path is exercised

```
EntityLayout (legacy, RoutedTabs)
  └── EntityLayout.Route path="/docs"
        └── EntityTechdocsContent
              └── TechDocsAddons
                    └── TechDocsReaderPage → TechDocsReaderPageContent → shadow DOM
```

This matches `packages/create-app/templates/legacy-app/.../EntityPage.tsx` and production Beacon wiring.

## Upstream root-cause references (unfixed in this branch)

These are the lines your fix PR should address; they explain why `RoutedTabs` unmount reproduces the bug:

| Symptom                        | Location                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Infinite spinner after remount | `plugins/techdocs/src/hooks/useTechDocsReaderContentData.ts` — `showProgress = state === 'CHECKING' \|\| isStyleLoading` |
| Scroll jump on tab return      | same file — `document?.querySelector('header')?.scrollIntoView()`                                                        |
| Aborted sync → Failed to fetch | `plugins/techdocs/src/reader/components/useReaderState.ts` — sync not abort-safe                                         |
| Shadow DOM stylesheet loss     | `plugins/techdocs-react/src/component.tsx` — style injection order on remount                                            |

Compare with Beacon yarn patches in `beacon/.yarn/patches/@backstage-plugin-techdocs-*.patch` for the intended fix behavior.

## PR evidence checklist

Copy into your upstream PR description:

```markdown
### Reproduction (before fix)

Environment: `yarn start:techdocs-repro` from Backstage repo root  
Entity: http://localhost:3000/catalog/default/component/documented-component/docs

Steps:

1. Open Docs tab
2. While spinner visible, switch to Overview
3. Switch back to Docs

Observed:

- [ ] Infinite spinner / stuck loading
- [ ] Scroll position jumps
- [ ] MkDocs icons oversized / layout broken
- [ ] "Failed to fetch" error panel
- [ ] Network: aborted GET /api/techdocs/sync/... when leaving tab mid-load

DevTools (after broken remount):
document.querySelector('#techdocs-shadow-root')?.shadowRoot?.querySelectorAll('link[rel="stylesheet"]').length
→ often 0 before fix

### Verification (after fix)

Same steps → docs load normally, styling intact, no fetch error.
Attach screen recording (30–60s) showing before/after.
```

## Running example-app with repro override

```bash
yarn start:techdocs-repro:example-app
```

This sets `BACKSTAGE_TECHDOCS_TAB_REPRO=true` and replaces the catalog alpha entity page with `EntityTabSwitchReproPage` (legacy `RoutedTabs` + `/docs` tab). Prefer `yarn start:techdocs-repro` unless you specifically need the new example-app shell.
