# Sample Documentation

Welcome to the sample documentation component. This page exists to test the **TechDocs in-app editor** plugin.

## What is this?

This is a minimal documentation site wired into Backstage's Software Catalog. It demonstrates:

- How TechDocs renders Markdown as a browsable docs site
- How the TechDocs editor plugin lets you edit and commit docs directly from the Backstage UI

## Pages

| Page                                      | Description                                      |
| ----------------------------------------- | ------------------------------------------------ |
| [Getting Started](getting-started.md)     | How to set up and run the project locally        |
| [Architecture](architecture.md)           | High-level system design                         |
| [Editor Playground](editor-playground.md) | Safe page for testing in-app edits and commits   |
| [Troubleshooting](troubleshooting.md)     | Common setup and auth issues for TechDocs editor |

## Editing these docs

Click the **Edit** button (pencil icon) in the top-right corner of any page to open the in-app editor. Changes are committed directly to the `Estehsan/backstage` repository as a draft pull request.

> **Tip:** You need a GitHub token with `repo` write access configured in `app-config.local.yaml` for the editor to commit changes.

## Suggested Edit Test Flow

1. Open **Editor Playground** and click **Edit**.
2. Change the date in the test checklist.
3. Add one bullet under "What changed".
4. Commit through the editor and confirm a draft PR is created.
