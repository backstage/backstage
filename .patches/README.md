# Patch Release Process

This directory tracks patches to be applied to the next patch release. It contains a list of patch files of the format `pr-<number>.txt` that define which pull requests should be included in the next patch release, where the content of the file is the description of the fix.

The [sync_patch-release.yml](/.github/workflows/sync_patch-release.yml) workflow will automatically create a "Patch Release" PR with the patches in this directory.

## Usage

To add a PR to the set of patches, run `yarn patch-pr <pr-number> <description>` in the root of the repository.

Once a patch has been applied and merged, manually delete the corresponding patch file from this directory. The patch script will automatically skip patches that have already been applied to the target branch, so it's safe to re-run the script even if some patches are already present.

## GitHub Workflow

A GitHub workflow automatically keeps a "Patch Release" PR in sync with the patches listed in this directory. When you add, modify, or remove patch files, the workflow will:

- Update the existing PR if patch files exist
- Close and delete the PR branch if no patch files exist
