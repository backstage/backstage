#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');

const TEMPLATES_DIR = path.join(__dirname);
const COMMON_FILE = path.join(TEMPLATES_DIR, '.common.yaml');

// Read the common fields from .common.yaml
const commonDoc = yaml.parseDocument(fs.readFileSync(COMMON_FILE, 'utf8'));
const commonFields = new Map(
  commonDoc.get('body').items.map(field => {
    field.commentBefore = ' This field is managed by .common.yaml';
    return [field.get('id'), field];
  }),
);

// Get all YAML files in the templates directory except .common.yaml
const templateFiles = fs
  .readdirSync(TEMPLATES_DIR)
  .filter(file => file.endsWith('.yaml') && file !== '.common.yaml');

// Process each template file
for (const templateFile of templateFiles) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const templateDoc = yaml.parseDocument(fs.readFileSync(templatePath, 'utf8'));

  if (templateDoc.get('body')) {
    const body = templateDoc.get('body');
    for (let i = 0; i < body.items.length; i++) {
      const field = body.items[i];

      const commonField = commonFields.get(field.get('id'));
      if (commonField) {
        body.items[i] = commonField;
      }
    }

    // Write the updated template back to file with matching style
    fs.writeFileSync(
      templatePath,
      templateDoc.toString({
        indent: 2,
        lineWidth: 0,
        minContentWidth: 0,
        singleQuote: true,
      }),
    );
    console.log(`Updated ${templateFile}`);
  }
}

console.log('Sync complete!');
