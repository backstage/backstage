const fs = require('fs');
const path = require('path');
const { bundle } = require('lightningcss');

const source = '../../packages/canon/src/css';
const destination = '../public';

const source1 = path.join(__dirname, `${source}/core.css`);
const destination1 = path.join(__dirname, `${destination}/core.css`);
const source2 = path.join(__dirname, `${source}/components.css`);
const destination2 = path.join(__dirname, `${destination}/components.css`);

// Function to bundle and copy the CSS file
const bundleAndCopyFile = async (source, destination) => {
  try {
    const result = await bundle({
      filename: source,
      minify: true,
    });

    fs.writeFileSync(destination, result.code);
    console.log('File bundled and copied successfully!');
  } catch (err) {
    console.error('Error bundling file:', err);
  }
};

// Initial bundle and copy
Promise.all([
  bundleAndCopyFile(source1, destination1),
  bundleAndCopyFile(source2, destination2),
])
  .then(() => {
    // Add an empty line after all operations are complete - It looks better in the terminal :)
    console.log('');
  })
  .catch(err => {
    console.error('Error in processing files:', err);
  });
