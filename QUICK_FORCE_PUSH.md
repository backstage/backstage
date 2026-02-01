# Quick Force Push Reference

## TL;DR - Safe Force Push

```bash
git push --force-with-lease origin copilot/sub-pr-32520
```

## If That Fails

```bash
git push --force origin copilot/sub-pr-32520
```

## Before You Push - Checklist

- [ ] `git status` - clean working directory
- [ ] `git log --oneline -5` - verify your commits look correct
- [ ] `git diff origin/copilot/sub-pr-32520` - review what will change
- [ ] Confirmed no one else is working on this branch

## After You Push - Verify

```bash
git log --oneline origin/copilot/sub-pr-32520 -3
```

Should match your local branch.

## What You're Updating

- Branch: `copilot/sub-pr-32520`
- Change: Alert CSS simplification (rebased onto master)
- Files: `packages/ui/src/components/Alert/Alert.module.css`

## Expected Outcome

The PR will show:
- Simplified CSS without intermediate variables
- Updated to use `-on-bg` suffix for color variables
- Based on latest master branch

---

**Need more details?** See `FORCE_PUSH_GUIDE.md` for comprehensive instructions.
