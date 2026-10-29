#!/bin/zsh
# usage: run-checks.sh <label>   (runs every project check, writes <label>-<id>.log and <label>.summary)
cd /Users/apple/Documents/GitHub/bs-cells/BS-NF-12
D=.sdlc/runs/20261028-feature-new-entity-former-names/checks
L=$1; : > $D/$L.summary.tmp
jq -r '.project_checks[] | "\(.id)\t\(.run)"' .sdlc/runs/20261028-feature-new-entity-former-names/change.sections/header.json | while IFS=$'\t' read -r id cmd; do
  zsh -c "$cmd" > $D/$L-$id.log 2>&1 < /dev/null; rc=$?
  echo "$id exit=$rc" >> $D/$L.summary.tmp
done
mv $D/$L.summary.tmp $D/$L.summary
