# Backstage Plugin Development — AI Assistant Setup

This folder contains configuration files that make both **GitHub Copilot Enterprise** and **Claude Code** follow Backstage plugin governance rules automatically.

---

## Quick Setup

### 1. Copy into your repository

```bash
# Copy the .github folder into your Backstage plugin repo root
cp -r .github/ /path/to/your-backstage-repo/.github/

# Copy the docs folder (for Copilot Knowledge Base indexing)
cp -r docs/ /path/to/your-backstage-repo/docs/
```

### 2. Commit and push

```bash
cd /path/to/your-backstage-repo
git add .github/ docs/
git commit -m "chore: add AI assistant instructions for Backstage plugin development"
git push
```

That's it. Both Copilot and Claude Code will pick up the instructions automatically.

---

## What's Included

### For GitHub Copilot Enterprise

| File | Purpose |
|---|---|
| `.github/copilot-instructions.md` | **Main instructions** — automatically loaded for every Copilot interaction in this repo. Contains all governance rules, naming conventions, API patterns. |
| `.github/instructions/backstage-plugin.instructions.md` | **Scoped to `plugin.ts` files** — ensures correct `createFrontendPlugin`/`createBackendPlugin` patterns. |
| `.github/instructions/backstage-router.instructions.md` | **Scoped to `router.ts` files** — enforces auth, health endpoints, Express patterns. |
| `.github/instructions/backstage-components.instructions.md` | **Scoped to `components/**/*.tsx`** — enforces entity card patterns, loading states, InfoCard usage. |
| `.github/instructions/backstage-tests.instructions.md` | **Scoped to `*.test.{ts,tsx}`** — enforces `renderInTestApp`, `startTestBackend`, proper mocking. |
| `docs/backstage-plugin-knowledge/` | **Reference docs** — can be indexed as a Copilot Knowledge Base for richer context. |

### For Claude Code

| File | Purpose |
|---|---|
| `backstage-plugins.skill` | **Claude skill file** — install with `claude skill install backstage-plugins.skill` |

---

## How It Works

### GitHub Copilot

**Automatic (no setup needed after commit):**
- `copilot-instructions.md` is read by Copilot for every suggestion and chat in this repo
- `.github/instructions/*.instructions.md` files are scoped — they only activate when you're editing files that match their `applyTo` pattern

**Optional — Knowledge Base (Enterprise):**
1. Go to your GitHub org → Settings → Copilot → Knowledge Bases
2. Create a new Knowledge Base
3. Add this repository's `docs/backstage-plugin-knowledge/` folder
4. Copilot Chat will now reference the full plugin development docs when answering questions

**VS Code Settings:**
Make sure you have these enabled in VS Code settings:
```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true
}
```

### Claude Code

```bash
# One-time install
claude skill install backstage-plugins.skill

# Then just use Claude Code normally — it auto-activates for Backstage work
claude "Build me a Backstage plugin that shows Datadog monitors on entity pages"
```

---

## What the AI Will Enforce

Regardless of which AI tool you use, these governance rules are enforced:

1. **ADR-011 naming** — correct npm scopes, package names, export conventions
2. **New system only** — `createFrontendPlugin`/`createBackendPlugin`, never legacy APIs
3. **Auth patterns** — `httpAuth.credentials()` on all endpoints, auth policies for health
4. **Config safety** — `config.d.ts` with `@visibility backend`, never expose secrets to frontend
5. **Entity annotations** — proper constants, `MissingAnnotationEmptyState` fallback
6. **Component patterns** — `InfoCard`, `Table`, `useAsync`, `Progress`, `ResponseErrorPanel`
7. **Testing** — `renderInTestApp`/`TestApiProvider` (FE), `startTestBackend` (BE)
8. **External API integration** — 3-tier pattern (FE → BE → External), never direct API calls from frontend
