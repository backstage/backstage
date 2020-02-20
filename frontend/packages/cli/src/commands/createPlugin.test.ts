import fs from 'fs';
import path from 'path';
import os from 'os';
import { createPluginFolder, createFileFromTemplate } from './createPlugin';

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
});
