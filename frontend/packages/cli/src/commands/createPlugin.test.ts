import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  createFileFromTemplate,
  createFromTemplateDir,
  createPluginFolder,
} from './createPlugin';

describe('createPlugin', () => {
  describe('createPluginFolder', () => {
    it('should create a plugin directory in the correct place', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
      try {
        const pluginFolder = createPluginFolder(tempDir, 'foo');
        expect(fs.existsSync(pluginFolder)).toBe(true);
        expect(pluginFolder).toMatch(/packages\/plugins\/foo/);
      } finally {
        fs.rmdirSync(tempDir, { recursive: true });
      }
    });

    it('should not create a plugin directory if it already exists', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
      try {
        const pluginFolder = createPluginFolder(tempDir, 'foo');
        expect(fs.existsSync(pluginFolder)).toBe(true);
        expect(() => createPluginFolder(tempDir, 'foo')).toThrowError(
          /A plugin with the same name already exists/,
        );
      } finally {
        fs.rmdirSync(tempDir, { recursive: true });
      }
    });
  });

  describe('createFileFromTemplate', () => {
    it('should generate a valid output with inserted values', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
      try {
        const sourceData = '{"name": "@spotify-backstage/{{id}}"}';
        const targetData = '{"name": "@spotify-backstage/foo"}';
        const sourcePath = path.join(tempDir, 'in.hbs');
        const targetPath = path.join(tempDir, 'out.json');
        fs.writeFileSync(sourcePath, sourceData);

        createFileFromTemplate(sourcePath, targetPath, { id: 'foo' });

        expect(fs.existsSync(targetPath)).toBe(true);
        expect(fs.readFileSync(targetPath).toString()).toBe(targetData);
      } finally {
        fs.rmdirSync(tempDir, { recursive: true });
      }
    });
  });

  describe('createFromTemplateDir', () => {
    it('should create sub-directories and files', async () => {
      const templateRootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
      const templateSubDir = fs.mkdtempSync(path.join(templateRootDir, 'sub-'));
      fs.writeFileSync(path.join(templateSubDir, 'test.txt'), 'testing');

      const destinationRootDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'test-'),
      );
      const subDir = path.join(
        destinationRootDir,
        path.basename(templateSubDir),
      );
      const testFile = path.join(
        destinationRootDir,
        path.basename(templateSubDir),
        'test.txt',
      );
      try {
        await createFromTemplateDir(templateRootDir, destinationRootDir, {});
        expect(fs.existsSync(subDir)).toBe(true);
        expect(fs.existsSync(testFile)).toBe(true);
      } finally {
        fs.rmdirSync(templateRootDir, { recursive: true });
        fs.rmdirSync(destinationRootDir, { recursive: true });
      }
    });
    xit('should handle errors on reading template directory', async () => {});
  });
});
