# Backstage MUI to BUI Migration Analytics

This script provides **accurate TypeScript AST-based analysis** of MUI to `@backstage/ui` migration progress in the Backstage repository.

**Key Benefits:**

- 🔍 **AST-Powered** - Uses [ts-morph](https://ts-morph.com/) for accurate TypeScript parsing
- 🎯 **Component Discovery** - Finds all components from import statements
- 📝 **Complex Patterns** - Handles aliases, destructuring, renamed imports
- 🚀 **Easy Access** - Run from anywhere using yarn scripts
- 📊 **GitHub Integration** - Automatically updates GitHub issues with migration progress
- ⚡ **Reliable** - Accurate component usage tracking

## 🚀 Quick Start

```bash
# From anywhere in the repository
yarn mui-to-bui              # Generate console report
yarn mui-to-bui --json       # Export detailed JSON data
yarn mui-to-bui --csv        # Export component usage CSV
yarn mui-to-bui --markdown   # Generate GitHub-optimized markdown
yarn mui-to-bui --components # Show detailed list of all components
```

## ✨ Features

### TypeScript AST Analysis

- 🔍 **Accurate** - Uses [ts-morph](https://ts-morph.com/) for proper TypeScript AST parsing
- 🎯 **Component Discovery** - Finds all components from import statements
- 📝 **Complex Patterns** - Handles aliases, destructuring, renamed imports
- ⚡ **Reliable** - Accurate component usage tracking
- 🚀 **Comprehensive** - Analyzes thousands of files efficiently

### Comprehensive Analysis

- Tracks MUI v4 (`@material-ui/*`), MUI v5 (`@mui/*`), and Backstage UI (`@backstage/ui`)
- Provides migration status and prioritized recommendations
- Generates detailed reports with component usage statistics

### Smart Recommendations

- Prioritizes MUI v4 migrations (highest priority)
- Identifies files with mixed imports (quick wins)
- Highlights most-used components for migration planning
- Provides actionable insights for migration priorities

### GitHub Integration

- Automatically updates a GitHub issue with migration progress
- Runs daily via GitHub Actions workflow
- Can be triggered manually for on-demand updates
- Formatted markdown with collapsible sections and progress bars

## 📊 Sample Output

```
🔍 Backstage MUI to BUI Migration Report
=======================================

Analyzing migration from MUI to @backstage/ui in the Backstage repository

📊 SUMMARY
--------------------
Total files analyzed: 2,847
Files with MUI imports: 987
Files with Backstage UI imports: 345
Total import statements: 2,134
Components found: 156

🚀 MIGRATION PROGRESS
--------------------
✅ Fully migrated: 345 files (25.9%)
🔄 Mixed imports: 234 files (17.5%)
❌ Not started: 756 files (56.6%)

📚 LIBRARY USAGE
--------------------
@material-ui/core: 1,234 imports in 456 files
@mui/material: 567 imports in 234 files
@backstage/ui: 345 imports in 234 files

💡 RECOMMENDATIONS
--------------------
🔴 756 files still use MUI v4 (@material-ui). These should be prioritized for migration.

🟡 234 files have mixed imports. Focus on completing these migrations first for quick wins.

🔵 Migration progress: 25.9% of files fully migrated to Backstage UI
```

## 🎯 What This Tells You

### Migration Priorities

1. **MUI v4 First**: Files using `@material-ui/*` should be migrated first
2. **Complete Mixed Files**: Files with both MUI and Backstage UI imports are easy wins
3. **Component Focus**: Prioritize the most-used components for maximum impact
4. **Track Progress**: Monitor migration progress over time with automated reports

### Actionable Insights

- **High Priority**: Identify files still using deprecated MUI v4
- **Quick Wins**: Files with mixed imports are partially migrated - finish them first
- **Component Usage**: See which components are most used to prioritize migration efforts
- **Progress Tracking**: Automated GitHub issue updates keep everyone informed

## 🔧 GitHub Workflow Integration

The migration progress is automatically tracked via GitHub Actions:

### Workflow Features

- **Daily Updates**: Runs every day at midnight UTC
- **Manual Trigger**: Can be triggered manually via GitHub Actions UI
- **Issue Updates**: Automatically updates [Issue #31467](https://github.com/backstage/backstage/issues/31467)
- **Formatted Reports**: GitHub-optimized markdown with tables and collapsible sections

### Workflow File

The workflow is defined in `.github/workflows/mui-migration-tracker.yml` and:

1. Checks out the repository
2. Sets up Node.js and installs dependencies
3. Runs the migration analysis script
4. Updates the GitHub issue with the latest report

## 📁 File Structure

```
scripts/mui-to-bui/
├── backstage-migration-analytics.js    # AST-powered migration analytics
└── README.md                          # This documentation

.github/workflows/
└── mui-migration-tracker.yml         # GitHub Actions workflow for automated updates
```

## 🛠 Technical Details

### Analysis Scope

- **File Types**: `.tsx`, `.ts`, `.jsx`, `.js`
- **Ignored Directories**: `node_modules`, `dist`, `build`, `.git`, `coverage`, `.yarn`
- **Import Tracking**: All MUI and Backstage UI package imports
- **Component Usage**: All components discovered via AST parsing

### TypeScript AST Parsing

- Uses [ts-morph](https://ts-morph.com/) for accurate parsing
- Handles complex import patterns (aliases, destructuring, etc.)
- Tracks component usage throughout the codebase
- Identifies unused imports for potential cleanup

## 🚨 Important Notes

### Performance

- Analysis takes ~30-60 seconds for the full repository
- Processes files in batches to avoid memory issues
- Efficiently analyzes thousands of files

### Dependencies

- Requires `ts-morph` package (already in dependencies)
- Uses Node.js built-in modules for file system operations
- GitHub Actions workflow uses `GITHUB_TOKEN` for issue updates

## 🔍 Understanding the Data

### Migration Status Categories

- **✅ Fully Migrated**: Only uses Backstage UI components
- **🔄 Mixed**: Uses both MUI and Backstage UI (partial migration)
- **❌ Not Started**: Only uses MUI components
- **ℹ️ Not Applicable**: No relevant UI imports found

### Library Categories

- **MUI v4**: `@material-ui/core`, `@material-ui/lab`, `@material-ui/icons`
- **MUI v5**: `@mui/material`, `@mui/lab`, `@mui/icons-material`
- **Backstage UI**: `@backstage/ui`, `@spotify-portal/canon`

This comprehensive analysis helps you make informed decisions about migration priorities and strategies, with automated tracking to monitor progress over time.

## 💾 Saving Output to Files

```bash
# Save outputs to files for sharing or further analysis
yarn mui-to-bui --markdown > migration-report.md
yarn mui-to-bui --csv > migration-components.csv
yarn mui-to-bui --json > migration-data.json
yarn mui-to-bui --components > all-components.txt

# Save with timestamps
yarn mui-to-bui --csv > "migration-$(date +%Y%m%d).csv"
yarn mui-to-bui --markdown > "migration-report-$(date +%Y%m%d).md"
```

## 🧩 Detailed Component Analysis

### View All Components

```bash
# See detailed breakdown of all 420+ components
yarn mui-to-bui --components
```

This shows:

- **📊 Complete component list** sorted by usage frequency
- **📁 Top files** using each component
- **⚠️ Imported but unused** components (potential cleanup opportunities)
- **📈 Usage statistics** for prioritizing migration efforts

### Sample Component Output

```
1. Typography
   Usage: 1,633 times across 705 files
   Top files:
     • plugins/catalog/src/components/CatalogTable/CatalogTable.tsx (15 uses)
     • plugins/search/src/components/SearchResult/SearchResult.tsx (14 uses)
     • plugins/techdocs/src/components/TechDocsPage.tsx (13 uses)
     ... and 702 more files

2. Box
   Usage: 1,572 times across 697 files
   Top files:
     • plugins/app-visualizer/src/components/AppVisualizerPage/DetailedVisualizer.tsx (15 uses)
     • plugins/scaffolder/src/components/TemplateCard/TemplateCard.tsx (14 uses)
     ... and 695 more files
```
