const fs = require('node:fs');
const path = require('node:path');
const { bundle } = require('lightningcss');
const chokidar = require('chokidar');

// Configuration
const config = {
  UIPath: '../../packages/ui',
  publicPath: '../public',
  files: [
    {
      source: 'css/styles.css',
      destination: 'theme-backstage.css',
      name: 'Main Styles',
    },
    {
      source: '../../.storybook/themes/spotify.css',
      destination: 'theme-spotify.css',
      name: 'Spotify Theme',
    },
  ],
};

class CSSSync {
  constructor() {
    this.UIPath = path.resolve(__dirname, config.UIPath);
    this.publicPath = path.resolve(__dirname, config.publicPath);
    this.isWatching = process.argv.includes('--watch');
  }

  async syncFile(fileConfig) {
    const sourcePath = path.join(this.UIPath, fileConfig.source);
    const destPath = path.join(this.publicPath, fileConfig.destination);

    try {
      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        console.warn(`⚠️  Source file not found: ${sourcePath}`);
        return false;
      }

      // Ensure destination directory exists
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      // Bundle and optimize CSS
      const result = await bundle({
        filename: sourcePath,
        minify: true,
      });

      // Write to destination
      fs.writeFileSync(destPath, result.code);

      console.log(
        `✅ ${fileConfig.name}: ${fileConfig.source} → ${fileConfig.destination}`,
      );
      return true;
    } catch (error) {
      console.error(`❌ Error syncing ${fileConfig.name}:`, error.message);
      return false;
    }
  }

  async syncAll() {
    console.log('🔄 Syncing CSS files...\n');

    let successCount = 0;
    for (const fileConfig of config.files) {
      if (await this.syncFile(fileConfig)) {
        successCount++;
      }
    }

    console.log(
      `\n✨ Synced ${successCount}/${config.files.length} CSS files successfully!`,
    );

    if (successCount > 0) {
      console.log('\n📁 Available CSS files in public/:');
      config.files.forEach(file => {
        const destPath = path.join(this.publicPath, file.destination);
        if (fs.existsSync(destPath)) {
          const stats = fs.statSync(destPath);
          const size = (stats.size / 1024).toFixed(2);
          console.log(`   • ${file.destination} (${size} KB)`);
        }
      });
    }
  }

  startWatching() {
    console.log('👀 Watching for CSS changes...\n');

    // Watch all source files
    const watchPaths = config.files.map(file =>
      path.join(this.UIPath, file.source),
    );

    const watcher = chokidar.watch(watchPaths, {
      ignored: /node_modules/,
      persistent: true,
    });

    watcher.on('change', async filePath => {
      console.log(
        `\n🔄 Change detected: ${path.relative(this.UIPath, filePath)}`,
      );

      // Find which file changed and sync it
      const fileConfig = config.files.find(file =>
        filePath.endsWith(file.source.replace(/\//g, path.sep)),
      );

      if (fileConfig) {
        await this.syncFile(fileConfig);
      }
    });

    watcher.on('error', error => console.error('❌ Watch error:', error));

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n👋 Stopping CSS sync...');
      watcher.close();
      process.exit(0);
    });
  }

  async run() {
    console.log('🎨 BUI CSS Sync Tool\n');
    console.log(`📂 BUI path: ${this.UIPath}`);
    console.log(`📂 Public path: ${this.publicPath}\n`);

    // Initial sync
    await this.syncAll();

    // Watch for changes if requested
    if (this.isWatching) {
      this.startWatching();
    }
  }
}

// Run the sync tool
const cssSync = new CSSSync();
cssSync.run().catch(error => {
  console.error('❌ CSS Sync failed:', error);
  process.exit(1);
});
