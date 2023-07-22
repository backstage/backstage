---
'@backstage/plugin-tech-radar': minor
---

Allows entries to be defined as `hidden` from the API. This hides the entries from the main radar with the goal of allowing users to have an additional category ("In Use", "Use", "Keep", etc). This additional category holds tech radar items that are company wide and already in use, removing them from the radar reduces clutter.

However, they still need to be visible, thus this adds a new search table and routing to the tech radar plugin. The new `/search` route allows searching for items, `hidden` or not, by title, area, etc. It also integrates with the description popup.
