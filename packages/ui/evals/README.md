# @backstage/ui — MCP Evals

A set of LLM evaluation tasks that measure the quality improvement provided by the [Storybook MCP server](https://storybook.js.org/docs/ai/mcp/overview) (`backstage-ui-mcp`) when generating UI code with `@backstage/ui` components.

Each task is run in two modes:

- **Baseline** — the LLM receives only the task prompt, no component documentation
- **MCP** — the LLM receives real component documentation fetched from the Storybook MCP server at `http://localhost:6006/mcp`, simulating what a Cursor or Claude Code agent sees when the MCP is enabled

The score difference between modes shows the concrete value the MCP adds.

## Prerequisites

1. An Anthropic API key
2. Node.js 18+ (for native `fetch`)
3. Storybook running locally (required for MCP mode)

## Setup

The eval dependencies (`tsx`, `@typescript-eslint/parser`) are installed as root devDependencies. No separate install step is needed beyond `yarn install` at the repo root.

## Running

```bash
# Start Storybook first (required for MCP mode)
yarn storybook &

# Run all tasks in both modes (default)
ANTHROPIC_API_KEY=sk-ant-... yarn eval:ui

# Run only baseline mode (no Storybook required)
ANTHROPIC_API_KEY=sk-ant-... yarn eval:ui --mode baseline

# Run only MCP mode
ANTHROPIC_API_KEY=sk-ant-... yarn eval:ui --mode mcp

# Run a single task
ANTHROPIC_API_KEY=sk-ant-... yarn eval:ui --task login-form

# Use a different model
ANTHROPIC_MODEL=claude-3-haiku-20240307 ANTHROPIC_API_KEY=sk-ant-... yarn eval:ui
```

## Environment variables

| Variable            | Default                      | Description                            |
| ------------------- | ---------------------------- | -------------------------------------- |
| `ANTHROPIC_API_KEY` | —                            | **Required.** Anthropic API key.       |
| `ANTHROPIC_MODEL`   | `claude-3-5-sonnet-20241022` | Anthropic model to use for generation. |
| `STORYBOOK_URL`     | `http://localhost:6006`      | Storybook dev server URL.              |

## Tasks

Tasks are defined in `tasks/` and split into two tiers:

### Tier 1 — Recipe / Guideline tasks

These are directly based on the golden-path composition stories in `packages/ui/src/recipes/` and `packages/ui/src/guidelines/`. They test whether an agent reproduces Backstage's idiomatic multi-component patterns. The **recipe conformance** score measures how closely the generated code matches the reference story's composition structure.

| ID                    | Title               | Reference story                                 |
| --------------------- | ------------------- | ----------------------------------------------- |
| `cards-with-list`     | Cards with List     | `src/recipes/CardsWithList.stories.tsx`         |
| `cards-with-table`    | Cards with Table    | `src/guidelines/CardsWithTable.stories.tsx`     |
| `header-with-actions` | Header with Actions | `src/recipes/PluginHeaderAndHeader.stories.tsx` |

### Tier 2 — Component API tasks

These test knowledge of individual component APIs, where prop hallucination is the main signal.

| ID            | Title            | Key components                         |
| ------------- | ---------------- | -------------------------------------- |
| `login-form`  | Login Form       | TextField, PasswordField, Button       |
| `dialog-form` | Dialog with Form | Dialog, TextField, Select, Button      |
| `data-table`  | Data Table       | Table, useTable, CellText, CellProfile |

## Scoring

Each result is scored on four dimensions (0–100):

| Dimension               | How                                                                  | Tasks                   |
| ----------------------- | -------------------------------------------------------------------- | ----------------------- |
| **Import correctness**  | AST: are all `@backstage/ui` components imported from that package?  | All                     |
| **Component selection** | AST: are all required components present in the JSX?                 | All                     |
| **Prop accuracy**       | AST: are only documented props used (no hallucinations)?             | All (requires MCP docs) |
| **Recipe conformance**  | AST: does the JSX composition match the reference story's structure? | Tier 1 only             |

The **composite score** is the average of all applicable dimensions.

## Results

Each run writes a JSON file to `results/YYYY-MM-DDTHH-MM-SSZ.json` containing the full generated code and scores for every task. This directory is gitignored.

## Adding new tasks

1. Create a new file in `tasks/` following the `EvalTask` interface from `types.ts`
2. Register it in `tasks/index.ts`
3. For Tier 1 tasks, provide a `referenceStoryPath` and `requiredCompositionChains`
