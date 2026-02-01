# How to Force Push Your Rebased Branch

## Current Situation

You have rebased the `copilot/sub-pr-32520` branch onto the latest master, which means the branch history has been rewritten. The remote branch on GitHub still has the old history, so you need to force push to update it.

## Prerequisites

Before force pushing, ensure:
1. ✅ You have the rebased branch checked out locally
2. ✅ You've verified the changes are correct (`git log`, `git diff`)
3. ✅ No one else is working on this branch (force push overwrites history)

## Option 1: Force Push with Lease (RECOMMENDED)

This is the safest option - it will only force push if no one else has pushed changes to the remote branch since your last fetch.

```bash
# Make sure you're on the correct branch
git checkout copilot/sub-pr-32520

# Verify your local changes look correct
git log --oneline -5

# Force push with lease (safer)
git push --force-with-lease origin copilot/sub-pr-32520
```

**Why use `--force-with-lease`?**
- It will fail if someone else pushed to the branch since you last fetched
- Prevents accidentally overwriting others' work
- Safer than plain `--force`

## Option 2: Regular Force Push

If `--force-with-lease` doesn't work (rare), use regular force push:

```bash
# Make sure you're on the correct branch
git checkout copilot/sub-pr-32520

# Force push (less safe)
git push --force origin copilot/sub-pr-32520
```

⚠️ **Warning**: This will overwrite the remote branch regardless of what's there.

## Step-by-Step Process

### 1. Verify Your Local Branch

```bash
# Check which branch you're on
git branch

# Should show: * copilot/sub-pr-32520

# View recent commits
git log --oneline -5

# Should show your rebased commit on top of master
```

### 2. Compare with Remote

```bash
# Fetch latest from remote
git fetch origin

# Compare your branch with remote
git log --oneline origin/copilot/sub-pr-32520..HEAD

# This shows commits you have that the remote doesn't
```

### 3. Perform the Force Push

```bash
# Use force-with-lease (recommended)
git push --force-with-lease origin copilot/sub-pr-32520

# OR use regular force (if needed)
git push --force origin copilot/sub-pr-32520
```

### 4. Verify the Push

```bash
# Check the remote branch matches your local
git log --oneline origin/copilot/sub-pr-32520 -3

# Should match your local branch
git log --oneline HEAD -3
```

## Expected Output

When successful, you'll see something like:

```
To https://github.com/backstage/backstage
 + 6cd5727...82dc421 copilot/sub-pr-32520 -> copilot/sub-pr-32520 (forced update)
```

The `+` indicates a non-fast-forward (forced) update.

## Troubleshooting

### Error: "Updates were rejected"

If you get an error like:
```
! [rejected]        copilot/sub-pr-32520 -> copilot/sub-pr-32520 (non-fast-forward)
```

**Solution**: You need to use `--force` or `--force-with-lease`

### Error: "stale info"

If `--force-with-lease` fails with "stale info":
```
! [rejected]        copilot/sub-pr-32520 -> copilot/sub-pr-32520 (stale info)
```

**Solution**: 
1. Someone else pushed to the branch
2. Fetch and review their changes: `git fetch origin`
3. Decide: rebase again on their changes, or use `--force` to overwrite

### Error: "Permission denied"

If you get a permission error:
- Ensure you have write access to the repository
- Check your GitHub authentication (SSH key or token)
- Try: `git remote -v` to verify the remote URL

## What Happens to the Pull Request?

After force pushing:
- ✅ The PR will automatically update with your new commits
- ✅ Old commits will be replaced with rebased commits
- ✅ The PR diff will show the new changes
- ⚠️ Previous review comments may be lost if commits changed significantly
- ℹ️ Force push events are logged in the PR timeline

## Best Practices

1. **Communicate**: If others might be reviewing, let them know you're about to force push
2. **Verify First**: Always check your changes before force pushing
3. **Use --force-with-lease**: Safer than plain --force
4. **Don't force push to main/master**: Only force push to feature branches
5. **Backup**: If unsure, create a backup branch first:
   ```bash
   git branch backup-copilot/sub-pr-32520
   ```

## Alternative: Create a New Branch

If you're uncomfortable with force push, you can create a new branch:

```bash
# Create new branch from your rebased state
git checkout -b copilot/sub-pr-32520-v2

# Push normally (no force needed)
git push origin copilot/sub-pr-32520-v2

# Then update the PR to point to the new branch on GitHub
```

## Quick Reference Card

```bash
# Check status
git status
git log --oneline -5

# Safe force push
git push --force-with-lease origin copilot/sub-pr-32520

# Unsafe force push (last resort)
git push --force origin copilot/sub-pr-32520

# Verify
git log --oneline origin/copilot/sub-pr-32520 -3
```

## Summary

For your specific situation with `copilot/sub-pr-32520`:

1. Ensure you have the rebased version checked out locally
2. Run: `git push --force-with-lease origin copilot/sub-pr-32520`
3. Verify the push succeeded
4. Check the PR on GitHub to see the updated changes

The rebased branch will now be on GitHub, and the PR will show the simplified Alert CSS changes based on the latest master.
