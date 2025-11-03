/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Backstage Migration Analytics Script
 *
 * Analyzes MUI to @backstage/ui migration progress across
 * Backstage OSS and Portal repositories using TypeScript AST parsing.
 *
 * Features:
 * - Discovers all components from import statements
 * - Tracks component usage through AST traversal
 * - Handles complex import patterns (aliases, destructuring, etc.)
 * - Compares migration progress between OSS and Portal
 */

const fs = require('fs');
const path = require('path');
const { Project } = require('ts-morph');

// Configuration
const CONFIG = {
  // Current repository
  repo: {
    localPath: null, // Will be set dynamically
    name: 'Backstage',
  },

  // File extensions to analyze
  extensions: ['.tsx', '.ts', '.jsx', '.js'],

  // Directories to ignore
  ignoreDirs: [
    'node_modules',
    'dist',
    'dist-types',
    'dist-storybook',
    'build',
    '.git',
    'coverage',
    'test-results',
    'e2e-test-report',
    '.yarn',
    'docs-ui',
    'microsite',
  ],

  // MUI import patterns to track
  muiPatterns: {
    '@material-ui/core': 'MUI v4 Core',
    '@material-ui/lab': 'MUI v4 Lab',
    '@material-ui/icons': 'MUI v4 Icons',
    '@material-ui/pickers': 'MUI v4 Pickers',
    '@mui/material': 'MUI v5 Material',
    '@mui/lab': 'MUI v5 Lab',
    '@mui/icons-material': 'MUI v5 Icons',
    '@mui/styles': 'MUI v5 Styles',
  },

  // Backstage UI patterns to track
  backstagePatterns: {
    '@backstage/ui': 'Backstage UI',
    '@spotify-portal/canon': 'Spotify Portal Canon',
  },
};

class BackstageMigrationAnalyzer {
  constructor() {
    this.scriptDir = path.dirname(__filename);
    this.repoRoot = this.findRepoRoot();
    CONFIG.repo.localPath = this.repoRoot;

    this.results = {
      summary: {
        totalFiles: 0,
        filesWithMUI: 0,
        filesWithBackstageUI: 0,
        totalImports: 0,
        muiImports: 0,
        backstageImports: 0,
        totalComponents: 0,
      },
      byLibrary: {},
      componentUsage: {},
      discoveredComponents: new Set(),
      recommendations: [],
      migrationProgress: {
        fullyMigrated: 0,
        partiallyMigrated: 0,
        notStarted: 0,
        mixed: 0,
      },
      fileDetails: [],
    };
  }

  findRepoRoot() {
    let currentDir = this.scriptDir;

    while (currentDir !== path.dirname(currentDir)) {
      const packageJsonPath = path.join(currentDir, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf-8'),
          );

          if (
            packageJson.backstage ||
            packageJson.name === 'root' ||
            (packageJson.workspaces && Array.isArray(packageJson.workspaces))
          ) {
            return currentDir;
          }
        } catch {
          // Continue searching if package.json is malformed
        }
      }

      currentDir = path.dirname(currentDir);
    }

    console.warn('⚠️  Could not find repository root, using fallback path');
    return path.resolve(this.scriptDir, '../../..');
  }

  async analyze(quiet = false) {
    if (!quiet) {
      console.log(`🔍 Backstage MUI to BUI Migration Analytics`);
      console.log(`=======================================`);
      console.log('');
    }

    // Analyze current repository
    if (!quiet) console.log(`📂 Analyzing ${CONFIG.repo.name}...`);
    await this.analyzeRepository(
      CONFIG.repo.name,
      CONFIG.repo.localPath,
      quiet,
    );
    if (!quiet) console.log('');

    this.calculateMigrationProgress();
    this.generateRecommendations();

    return this.results;
  }

  async analyzeRepository(repoName, repoPath, quiet = false) {
    if (!fs.existsSync(repoPath)) {
      if (!quiet) console.warn(`⚠️  Repository not found: ${repoPath}`);
      return;
    }

    if (!quiet) console.log(`   Creating TypeScript project...`);

    // Create ts-morph project for this repository
    const project = new Project({
      tsConfigFilePath: path.join(repoPath, 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });

    // Only analyze packages and plugins directories (excluding packages/ui - the target library)
    const packagesDir = path.join(repoPath, 'packages');
    const pluginsDir = path.join(repoPath, 'plugins');
    const uiPackageDir = path.join(repoPath, 'packages', 'ui');

    let files = [];
    if (fs.existsSync(packagesDir)) {
      const packageFiles = this.findRelevantFiles(packagesDir);
      // Exclude packages/ui since it's the target library, not a consumer
      files = files.concat(
        packageFiles.filter(file => !file.startsWith(uiPackageDir)),
      );
    }
    if (fs.existsSync(pluginsDir)) {
      files = files.concat(this.findRelevantFiles(pluginsDir));
    }
    if (!quiet) console.log(`   Found ${files.length} files to analyze`);

    // Add files to the project (only .ts/.tsx files for proper AST parsing)
    const tsFiles = files.filter(
      file => file.endsWith('.ts') || file.endsWith('.tsx'),
    );

    if (!quiet)
      console.log(`   Analyzing ${tsFiles.length} TypeScript files...`);

    // Process files in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < tsFiles.length; i += batchSize) {
      const batch = tsFiles.slice(i, i + batchSize);

      try {
        // Add batch to project
        const sourceFiles = batch
          .map(filePath => {
            try {
              return project.addSourceFileAtPath(filePath);
            } catch (error) {
              if (!quiet) {
                console.warn(
                  `   ⚠️  Could not parse ${path.relative(
                    repoPath,
                    filePath,
                  )}: ${error.message}`,
                );
              }
              return null;
            }
          })
          .filter(Boolean);

        // Analyze each source file
        for (const sourceFile of sourceFiles) {
          const fileAnalysis = this.analyzeSourceFileWithAST(
            sourceFile,
            repoPath,
            repoName,
          );
          if (
            fileAnalysis &&
            (fileAnalysis.imports.mui.length > 0 ||
              fileAnalysis.imports.backstage.length > 0)
          ) {
            this.results.fileDetails.push(fileAnalysis);
            this.updateGlobalSummary(fileAnalysis);

            // Track discovered components
            Object.keys(fileAnalysis.components).forEach(component => {
              this.results.discoveredComponents.add(component);
            });
          }
        }

        // Remove files from project to free memory
        sourceFiles.forEach(sf => sf.forget());
      } catch (error) {
        if (!quiet)
          console.warn(`   ⚠️  Error processing batch: ${error.message}`);
      }
    }

    this.results.summary.totalComponents =
      this.results.discoveredComponents.size;
    this.results.summary.totalFiles = files.length;

    if (!quiet) {
      console.log(
        `   Summary: ${this.results.summary.filesWithMUI} MUI files, ${this.results.summary.filesWithBackstageUI} Backstage UI files`,
      );
      console.log(
        `   Found ${this.results.discoveredComponents.size} unique components`,
      );
    }
  }

  analyzeSourceFileWithAST(sourceFile, repoRoot, repoName) {
    try {
      const filePath = sourceFile.getFilePath();
      const relativePath = path.relative(repoRoot, filePath);

      const fileAnalysis = {
        path: relativePath,
        repository: repoName,
        imports: {
          mui: [],
          backstage: [],
        },
        components: {},
        migrationStatus: 'not-started',
      };

      // Analyze imports using AST
      this.analyzeImportsWithAST(sourceFile, fileAnalysis);

      // Analyze component usage using AST
      this.analyzeComponentUsageWithAST(sourceFile, fileAnalysis);

      // Determine migration status
      this.determineMigrationStatus(fileAnalysis);

      return fileAnalysis;
    } catch (error) {
      console.warn(
        `⚠️  Could not analyze file with AST: ${sourceFile.getFilePath()} - ${
          error.message
        }`,
      );
      return null;
    }
  }

  analyzeImportsWithAST(sourceFile, fileAnalysis) {
    // Get all import declarations
    const importDeclarations = sourceFile.getImportDeclarations();

    importDeclarations.forEach(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      // Check if it's a MUI import
      for (const [muiPackage, description] of Object.entries(
        CONFIG.muiPatterns,
      )) {
        if (
          moduleSpecifier === muiPackage ||
          moduleSpecifier.startsWith(`${muiPackage}/`)
        ) {
          const importInfo = {
            package: muiPackage,
            path: moduleSpecifier,
            statement: importDecl.getText().trim(),
            description,
            namedImports: [],
            defaultImport: null,
          };

          // Extract named imports
          const namedImports = importDecl.getNamedImports();
          namedImports.forEach(namedImport => {
            const name = namedImport.getName();
            const alias = namedImport.getAliasNode()?.getText();
            importInfo.namedImports.push({ name, alias });
          });

          // Extract default import
          const defaultImport = importDecl.getDefaultImport();
          if (defaultImport) {
            importInfo.defaultImport = defaultImport.getText();
          }

          fileAnalysis.imports.mui.push(importInfo);

          if (!this.results.byLibrary[muiPackage]) {
            this.results.byLibrary[muiPackage] = { count: 0, files: new Set() };
          }
          this.results.byLibrary[muiPackage].count++;
          this.results.byLibrary[muiPackage].files.add(fileAnalysis.path);
        }
      }

      // Check if it's a Backstage UI import
      for (const [backstagePackage, description] of Object.entries(
        CONFIG.backstagePatterns,
      )) {
        if (
          moduleSpecifier === backstagePackage ||
          moduleSpecifier.startsWith(`${backstagePackage}/`)
        ) {
          const importInfo = {
            package: backstagePackage,
            path: moduleSpecifier,
            statement: importDecl.getText().trim(),
            description,
            namedImports: [],
            defaultImport: null,
          };

          // Extract named imports
          const namedImports = importDecl.getNamedImports();
          namedImports.forEach(namedImport => {
            const name = namedImport.getName();
            const alias = namedImport.getAliasNode()?.getText();
            importInfo.namedImports.push({ name, alias });
          });

          // Extract default import
          const defaultImport = importDecl.getDefaultImport();
          if (defaultImport) {
            importInfo.defaultImport = defaultImport.getText();
          }

          fileAnalysis.imports.backstage.push(importInfo);

          if (!this.results.byLibrary[backstagePackage]) {
            this.results.byLibrary[backstagePackage] = {
              count: 0,
              files: new Set(),
            };
          }
          this.results.byLibrary[backstagePackage].count++;
          this.results.byLibrary[backstagePackage].files.add(fileAnalysis.path);
        }
      }
    });
  }

  analyzeComponentUsageWithAST(sourceFile, fileAnalysis) {
    const { SyntaxKind } = require('ts-morph');

    // Get all imported component names (including aliases) with their source library
    const componentNames = new Map(); // name -> { alias, isMUI }

    fileAnalysis.imports.mui.forEach(importInfo => {
      // Add named imports from MUI
      importInfo.namedImports.forEach(({ name, alias }) => {
        componentNames.set(name, { alias: alias || name, isMUI: true });
      });

      // Add default import from MUI
      if (importInfo.defaultImport) {
        componentNames.set(importInfo.defaultImport, {
          alias: importInfo.defaultImport,
          isMUI: true,
        });
      }
    });

    fileAnalysis.imports.backstage.forEach(importInfo => {
      // Add named imports from Backstage UI
      importInfo.namedImports.forEach(({ name, alias }) => {
        componentNames.set(name, { alias: alias || name, isMUI: false });
      });

      // Add default import from Backstage UI
      if (importInfo.defaultImport) {
        componentNames.set(importInfo.defaultImport, {
          alias: importInfo.defaultImport,
          isMUI: false,
        });
      }
    });

    // Find JSX elements using proper ts-morph API
    const jsxElements = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ];

    // Count usage of each component
    componentNames.forEach((componentInfo, originalName) => {
      let count = 0;

      // Count JSX elements
      jsxElements.forEach(element => {
        let tagName;

        if (element.getKind() === SyntaxKind.JsxElement) {
          tagName = element.getOpeningElement().getTagNameNode().getText();
        } else if (element.getKind() === SyntaxKind.JsxSelfClosingElement) {
          tagName = element.getTagNameNode().getText();
        }

        if (tagName === componentInfo.alias) {
          count++;
        }
      });

      if (count > 0) {
        fileAnalysis.components[originalName] = count;

        if (!this.results.componentUsage[originalName]) {
          this.results.componentUsage[originalName] = {
            total: 0,
            files: [],
            isMUI: componentInfo.isMUI,
          };
        }
        this.results.componentUsage[originalName].total += count;
        this.results.componentUsage[originalName].files.push({
          path: fileAnalysis.path,
          count: count,
          repository: fileAnalysis.repository || 'Unknown',
        });
      }
    });
  }

  findRelevantFiles(dir, files = []) {
    if (!fs.existsSync(dir)) {
      return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!CONFIG.ignoreDirs.includes(item) && !item.startsWith('.')) {
          this.findRelevantFiles(fullPath, files);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (CONFIG.extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  determineMigrationStatus(fileAnalysis) {
    const hasMUI = fileAnalysis.imports.mui.length > 0;
    const hasBackstage = fileAnalysis.imports.backstage.length > 0;

    if (!hasMUI && !hasBackstage) {
      fileAnalysis.migrationStatus = 'not-applicable';
    } else if (hasMUI && hasBackstage) {
      fileAnalysis.migrationStatus = 'mixed';
    } else if (hasBackstage && !hasMUI) {
      fileAnalysis.migrationStatus = 'fully-migrated';
    } else if (hasMUI && !hasBackstage) {
      fileAnalysis.migrationStatus = 'not-started';
    }
  }

  updateGlobalSummary(fileAnalysis) {
    if (fileAnalysis.imports.mui.length > 0) {
      this.results.summary.filesWithMUI++;
      this.results.summary.muiImports += fileAnalysis.imports.mui.length;
    }

    if (fileAnalysis.imports.backstage.length > 0) {
      this.results.summary.filesWithBackstageUI++;
      this.results.summary.backstageImports +=
        fileAnalysis.imports.backstage.length;
    }

    this.results.summary.totalImports +=
      fileAnalysis.imports.mui.length + fileAnalysis.imports.backstage.length;
  }

  calculateMigrationProgress() {
    this.results.fileDetails.forEach(file => {
      switch (file.migrationStatus) {
        case 'fully-migrated':
          this.results.migrationProgress.fullyMigrated++;
          break;
        case 'mixed':
          this.results.migrationProgress.mixed++;
          break;
        case 'not-started':
          this.results.migrationProgress.notStarted++;
          break;
        default:
          // Handle other migration statuses (e.g., 'not-applicable')
          break;
      }
    });
  }

  generateRecommendations() {
    const recommendations = [];
    const totalFiles = this.results.fileDetails.length;

    // Migration progress
    if (totalFiles > 0) {
      const migrationRate =
        (this.results.migrationProgress.fullyMigrated / totalFiles) * 100;

      recommendations.push({
        priority: 'INFO',
        type: 'migration-progress',
        message: `Migration progress: ${migrationRate.toFixed(
          1,
        )}% of files fully migrated to Backstage UI`,
        data: {
          rate: migrationRate,
          files: totalFiles,
        },
      });
    }

    // Component insights
    const totalComponents = this.results.discoveredComponents.size;
    recommendations.push({
      priority: 'INFO',
      type: 'component-summary',
      message: `Found ${totalComponents} unique components in the repository`,
      data: {
        totalComponents,
        components: Array.from(this.results.discoveredComponents),
      },
    });

    // High-priority MUI v4 migrations
    const muiV4Files = this.results.fileDetails.filter(f =>
      f.imports.mui.some(imp => imp.package.includes('@material-ui')),
    );

    if (muiV4Files.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        type: 'mui-v4-upgrade',
        message: `${muiV4Files.length} files still use MUI v4 (@material-ui). These should be prioritized for migration.`,
      });
    }

    // Mixed imports - quick wins
    if (this.results.migrationProgress.mixed > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        type: 'mixed-imports',
        message: `${this.results.migrationProgress.mixed} files have mixed imports. Focus on completing these migrations first for quick wins.`,
      });
    }

    // Most used components that could be migrated
    const topComponents = Object.entries(this.results.componentUsage)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 10);

    if (topComponents.length > 0) {
      recommendations.push({
        priority: 'INFO',
        type: 'top-components',
        message: 'Most frequently used components in the repository:',
        data: topComponents.map(([name, data]) => ({
          component: name,
          usage: data.total,
        })),
      });
    }

    this.results.recommendations = recommendations;
  }

  generateReport() {
    const report = [];

    // Header
    report.push('🔍 Backstage MUI to BUI Migration Report');
    report.push('=======================================');
    report.push('');
    report.push(
      'Analyzing migration from MUI to @backstage/ui in the Backstage repository',
    );
    report.push('');

    // Summary
    report.push('📊 SUMMARY');
    report.push('-'.repeat(20));
    report.push(`Total files analyzed: ${this.results.summary.totalFiles}`);
    report.push(`Files with MUI imports: ${this.results.summary.filesWithMUI}`);
    report.push(
      `Files with Backstage UI imports: ${this.results.summary.filesWithBackstageUI}`,
    );
    report.push(
      `Total import statements: ${this.results.summary.totalImports}`,
    );
    report.push(`Components found: ${this.results.summary.totalComponents}`);
    report.push('');

    // Migration Progress
    const totalRelevantFiles =
      this.results.migrationProgress.fullyMigrated +
      this.results.migrationProgress.mixed +
      this.results.migrationProgress.notStarted;

    if (totalRelevantFiles > 0) {
      const fullyPct = (
        (this.results.migrationProgress.fullyMigrated / totalRelevantFiles) *
        100
      ).toFixed(1);
      const mixedPct = (
        (this.results.migrationProgress.mixed / totalRelevantFiles) *
        100
      ).toFixed(1);
      const notStartedPct = (
        (this.results.migrationProgress.notStarted / totalRelevantFiles) *
        100
      ).toFixed(1);

      report.push('🚀 MIGRATION PROGRESS');
      report.push('-'.repeat(20));
      report.push(
        `✅ Fully migrated: ${this.results.migrationProgress.fullyMigrated} files (${fullyPct}%)`,
      );
      report.push(
        `🔄 Mixed imports: ${this.results.migrationProgress.mixed} files (${mixedPct}%)`,
      );
      report.push(
        `❌ Not started: ${this.results.migrationProgress.notStarted} files (${notStartedPct}%)`,
      );
      report.push('');
    }

    // Library Usage Breakdown
    report.push('📚 LIBRARY USAGE');
    report.push('-'.repeat(20));
    Object.entries(this.results.byLibrary).forEach(([lib, data]) => {
      report.push(`${lib}: ${data.count} imports in ${data.files.size} files`);
    });
    report.push('');

    // Top Components (discovered automatically)
    const topComponents = Object.entries(this.results.componentUsage)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 15);

    if (topComponents.length > 0) {
      report.push('🔧 TOP COMPONENTS BY USAGE');
      report.push('-'.repeat(20));
      topComponents.forEach(([component, data], index) => {
        report.push(
          `${index + 1}. ${component}: ${data.total} usages across ${
            data.files.length
          } files`,
        );
      });
      report.push('');
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      report.push('💡 RECOMMENDATIONS');
      report.push('-'.repeat(20));
      this.results.recommendations.forEach(rec => {
        let priority = '🔵'; // Default for INFO
        if (rec.priority === 'HIGH') {
          priority = '🔴';
        } else if (rec.priority === 'MEDIUM') {
          priority = '🟡';
        }
        report.push(`${priority} ${rec.message}`);

        if (rec.data && Array.isArray(rec.data)) {
          rec.data.forEach(item => {
            if (item.component) {
              report.push(`   - ${item.component}: ${item.usage} usages`);
            }
          });
        }

        report.push('');
      });
    }

    // Features note
    report.push('✨ FEATURES');
    report.push('-'.repeat(20));
    report.push('🎯 Component discovery from import statements');
    report.push('🔍 TypeScript AST parsing for accurate analysis');
    report.push('📝 Handles complex import patterns (aliases, destructuring)');
    report.push('⚡ Reliable component usage tracking');
    report.push('');

    // Export options
    report.push('💾 DATA EXPORT');
    report.push('-'.repeat(20));
    report.push('Run with --json flag to export detailed data in JSON format');
    report.push(
      'Run with --csv flag to export component usage data in CSV format',
    );
    report.push('');

    return report.join('\n');
  }

  exportJSON() {
    // Convert Sets to Arrays for JSON serialization
    const exportData = { ...this.results };
    Object.keys(exportData.byLibrary).forEach(lib => {
      exportData.byLibrary[lib].files = Array.from(
        exportData.byLibrary[lib].files,
      );
    });

    // Convert discovered components Set to Array
    exportData.discoveredComponents = Array.from(
      this.results.discoveredComponents,
    );

    return JSON.stringify(exportData, null, 2);
  }

  exportCSV() {
    const rows = [['Component', 'Total Usage', 'Files Count', 'Example Files']];

    Object.entries(this.results.componentUsage)
      .sort(([, a], [, b]) => b.total - a.total)
      .forEach(([component, data]) => {
        const exampleFiles = data.files
          .slice(0, 3)
          .map(f => f.path)
          .join('; ');
        rows.push([component, data.total, data.files.length, exampleFiles]);
      });

    return rows.map(row => row.join(',')).join('\n');
  }

  generateComponentsList() {
    const report = [];

    report.push('🧩 ALL DISCOVERED COMPONENTS');
    report.push('='.repeat(50));
    report.push('');

    if (this.results.discoveredComponents.size === 0) {
      report.push('No components found.');
      return report.join('\n');
    }

    report.push(
      `Found ${this.results.discoveredComponents.size} unique components:`,
    );
    report.push('');

    // Sort components by total usage
    const sortedComponents = Object.entries(this.results.componentUsage).sort(
      ([, a], [, b]) => b.total - a.total,
    );

    sortedComponents.forEach(([component, data], index) => {
      report.push(`${index + 1}. ${component}`);
      report.push(
        `   Usage: ${data.total} times across ${data.files.length} files`,
      );

      // Show top 5 files for this component
      const topFiles = data.files.sort((a, b) => b.count - a.count).slice(0, 5);

      report.push('   Top files:');
      topFiles.forEach(file => {
        report.push(`     • ${file.path} (${file.count} uses)`);
      });

      if (data.files.length > 5) {
        report.push(`     ... and ${data.files.length - 5} more files`);
      }

      report.push('');
    });

    // Show components that were imported but not used
    const allImportedComponents = new Set();
    this.results.fileDetails.forEach(file => {
      [...file.imports.mui, ...file.imports.backstage].forEach(importInfo => {
        importInfo.namedImports.forEach(({ name }) => {
          allImportedComponents.add(name);
        });
        if (importInfo.defaultImport) {
          allImportedComponents.add(importInfo.defaultImport);
        }
      });
    });

    const unusedComponents = Array.from(allImportedComponents).filter(
      component => !this.results.componentUsage[component],
    );

    if (unusedComponents.length > 0) {
      report.push('⚠️  IMPORTED BUT NOT USED');
      report.push('-'.repeat(30));
      report.push(
        `Found ${unusedComponents.length} components that are imported but not used in JSX:`,
      );
      report.push('');
      unusedComponents.sort().forEach((component, index) => {
        report.push(`${index + 1}. ${component}`);
      });
      report.push('');
      report.push(
        'Note: These might be used in non-JSX contexts (e.g., makeStyles, styled components)',
      );
    }

    return report.join('\n');
  }

  generateMarkdown() {
    const md = [];
    const now = new Date().toISOString().split('T')[0];

    // Calculate percentages first
    const totalRelevantFiles =
      this.results.migrationProgress.fullyMigrated +
      this.results.migrationProgress.mixed +
      this.results.migrationProgress.notStarted;

    const fullyPct =
      totalRelevantFiles > 0
        ? (
            (this.results.migrationProgress.fullyMigrated /
              totalRelevantFiles) *
            100
          ).toFixed(1)
        : '0.0';
    const mixedPct =
      totalRelevantFiles > 0
        ? (
            (this.results.migrationProgress.mixed / totalRelevantFiles) *
            100
          ).toFixed(1)
        : '0.0';
    const notStartedPct =
      totalRelevantFiles > 0
        ? (
            (this.results.migrationProgress.notStarted / totalRelevantFiles) *
            100
          ).toFixed(1)
        : '0.0';

    // Progress Bar
    const barLength = 50;
    const fullyCount = Math.round((fullyPct / 100) * barLength);
    const mixedCount = Math.round((mixedPct / 100) * barLength);
    const notStartedCount = barLength - fullyCount - mixedCount;

    // Migration Status
    md.push(`## 🚀 Migration Status`);
    md.push('');
    md.push(
      'This issue tracks the progress of migrating from Material-UI to `@backstage/ui` components.',
    );
    md.push('');
    md.push('```');
    md.push(
      `${
        '█'.repeat(fullyCount) +
        '▓'.repeat(mixedCount) +
        '░'.repeat(notStartedCount)
      } ${fullyPct}% Complete`,
    );
    md.push('```');
    md.push('');
    md.push('| Status | Files | Percentage |');
    md.push('|--------|-------|------------|');
    md.push(
      `| ✅ Fully Migrated | ${this.results.migrationProgress.fullyMigrated} | ${fullyPct}% |`,
    );
    md.push(
      `| 🔄 Mixed (Partial) | ${this.results.migrationProgress.mixed} | ${mixedPct}% |`,
    );
    md.push(
      `| ❌ Not Started | ${this.results.migrationProgress.notStarted} | ${notStartedPct}% |`,
    );

    md.push('');

    // Library Usage
    md.push(`## 📚 Library Usage Breakdown`);
    md.push('');
    md.push('| Library | Import Count | Files |');
    md.push('|---------|--------------|-------|');
    Object.entries(this.results.byLibrary)
      .sort(([, a], [, b]) => b.count - a.count)
      .forEach(([lib, data]) => {
        md.push(`| \`${lib}\` | ${data.count} | ${data.files.size} |`);
      });
    md.push('');

    // Split components by source library
    const muiComponents = Object.entries(this.results.componentUsage)
      .filter(([, data]) => data.isMUI)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 20);

    const buiComponents = Object.entries(this.results.componentUsage)
      .filter(([, data]) => !data.isMUI)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 20);

    // Top MUI Components (need migration)
    if (muiComponents.length > 0) {
      md.push(`## 🔧 Top 20 MUI Components (Need Migration)`);
      md.push('');
      md.push('| Rank | Component | Usage Count | Files |');
      md.push('|------|-----------|-------------|-------|');
      muiComponents.forEach(([component, data], index) => {
        md.push(
          `| ${index + 1} | \`${component}\` | ${data.total} | ${
            data.files.length
          } |`,
        );
      });
      md.push('');
    }

    // Top Backstage UI Components (already migrated)
    if (buiComponents.length > 0) {
      md.push(`## ✅ Top 20 Backstage UI Components (Migrated)`);
      md.push('');
      md.push('| Rank | Component | Usage Count | Files |');
      md.push('|------|-----------|-------------|-------|');
      buiComponents.forEach(([component, data], index) => {
        md.push(
          `| ${index + 1} | \`${component}\` | ${data.total} | ${
            data.files.length
          } |`,
        );
      });
      md.push('');
    }

    // Recommendations (only show HIGH and MEDIUM priority, skip INFO as it's redundant)
    const highPriority = this.results.recommendations.filter(
      r => r.priority === 'HIGH',
    );
    const mediumPriority = this.results.recommendations.filter(
      r => r.priority === 'MEDIUM',
    );

    const hasRecommendations =
      highPriority.length > 0 || mediumPriority.length > 0;

    if (hasRecommendations) {
      md.push(`## 💡 Recommendations`);
      md.push('');

      if (highPriority.length > 0) {
        md.push(`### 🔴 High Priority`);
        md.push('');
        highPriority.forEach(rec => {
          md.push(`- ${rec.message}`);
        });
        md.push('');
      }

      if (mediumPriority.length > 0) {
        md.push(`### 🟡 Medium Priority`);
        md.push('');
        mediumPriority.forEach(rec => {
          md.push(`- ${rec.message}`);
        });
        md.push('');
      }
    }

    // Detailed Statistics (Overview moved to bottom)
    md.push(`## 📊 Detailed Statistics`);
    md.push('');
    md.push('| Metric | Count |');
    md.push('|--------|-------|');
    md.push(`| Total Files Analyzed | ${this.results.summary.totalFiles} |`);
    md.push(
      `| Files with MUI Imports | ${this.results.summary.filesWithMUI} |`,
    );
    md.push(
      `| Files with Backstage UI Imports | ${this.results.summary.filesWithBackstageUI} |`,
    );
    md.push(
      `| Unique Components Found | ${this.results.summary.totalComponents} |`,
    );
    md.push('');

    // Footer
    md.push('---');
    md.push('');
    md.push(
      '_This report is automatically generated by the [MUI to BUI Migration Analytics Script](../../scripts/mui-to-bui/backstage-migration-analytics.js)_',
    );
    md.push('');
    md.push(`**Last Updated:** ${now}`);

    return md.join('\n');
  }

  cleanup() {
    // Optional: Clean up temporary directory
    // Note: No longer needed since we don't clone OSS repo
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const jsonFlag = args.includes('--json');
  const csvFlag = args.includes('--csv');
  const markdownFlag = args.includes('--markdown');
  const componentsFlag = args.includes('--components');
  const helpFlag = args.includes('--help') || args.includes('-h');

  if (helpFlag) {
    console.log(`
🔍 Backstage MUI to BUI Migration Analytics

This script uses TypeScript AST parsing to analyze migration progress from
Material-UI to @backstage/ui components in the Backstage repository.

Features:
🔍 TypeScript AST parsing for accurate analysis
🎯 Component discovery from import statements
📝 Handles complex import patterns (aliases, destructuring, etc.)
⚡ Reliable component usage tracking
📊 GitHub-optimized markdown reports

Usage: yarn mui-to-bui [options]

Options:
  --json        Export detailed results as JSON
  --csv         Export component usage as CSV
  --markdown    Generate GitHub-optimized markdown (for issue updates)
  --components  Show detailed list of all discovered components
  --help, -h    Show this help message

Examples:
  yarn mui-to-bui
  yarn mui-to-bui --json
  yarn mui-to-bui --markdown > report.md
  yarn mui-to-bui --components

The script will automatically:
1. Analyze the current Backstage repository
2. Use TypeScript AST parsing to analyze imports
3. Find all components from import statements
4. Generate comprehensive migration reports
5. Provide recommendations for migration priorities
    `);
    return;
  }

  const analyzer = new BackstageMigrationAnalyzer();

  try {
    // Use quiet mode for data exports to avoid console output in the exported data
    const useQuiet = jsonFlag || csvFlag || markdownFlag || componentsFlag;
    await analyzer.analyze(useQuiet);

    if (jsonFlag) {
      console.log(analyzer.exportJSON());
    } else if (csvFlag) {
      console.log(analyzer.exportCSV());
    } else if (markdownFlag) {
      console.log(analyzer.generateMarkdown());
    } else if (componentsFlag) {
      console.log(analyzer.generateComponentsList());
    } else {
      console.log(analyzer.generateReport());
    }
  } catch (error) {
    console.error('❌ Error running migration analysis:', error.message);
    process.exit(1);
  }
}

// Export for testing
if (require.main === module) {
  main();
} else {
  module.exports = { BackstageMigrationAnalyzer, CONFIG };
}
