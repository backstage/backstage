---
'@backstage/plugin-home': patch
---

Added new frontend system widget blueprints for Most Visited, Recently Visited, and World Clocks. The Toolkit widget now supports configurable tools with icon resolution via `app-config.yaml`. The World Clock widget supports configurable time zones and time format. Added a `defaultConfig` option to the home page config schema for defining the initial grid layout. Added descriptions to all widget blueprints for the Add Widget dialog. The visited widgets now gracefully handle disabled visit tracking with a helpful message instead of erroring. Added layout position labels (column, row, width, height) in edit mode. Increased icon size in the Toolkit widget. Refactored World Clock to share clock logic with HeaderWorldClock.
