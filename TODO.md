# PR Process Optimizations

## Learnings from current PR review board

Good:

- Things pop up in needs triage

Needs:

- Automation of other columns
- Too many lanes
- Cleanup of Done
- Single tab to capture full PR queue
- clear way to give re-review higher prio than initial reviews

TODO:

- Move tooling to a separate action, backstage/actions
- Migrate existing tooling into those actions
- Automate cleanup of DONE column - try to get rid of done column
- Automate changes requested after review
- Add techdocs to changeset codeowners
- Automate no DCO - do not show in the PR review board
  - Redirect ADOPTERS.md to the form in no DCO?

## Status tweaks

- WIP: remove -> Replace with draft PRs
- Stalled: remove -> add latest change timestamp instead
- No DCO: remove -> label instead - do not add to board [workflow needed]
- Needs assistance -> remove
- External: renamed to "External Review" - if possible, do not add these to board at all
- Needs triage: Unsure, maybe remove, maybe "Needs owner"? TBD
- Needs review: TBD
- Changes requested: TBD
- Awaiting merge: maybe rename "automerge"? But actually automate this - bit lower prio than the rest
- Delayed merge: Probably keep
- Done: remove -> just remove from board instead
