const fs = require('fs');
const path = require('path');
const { bundle } = require('lightningcss');

const source = '../../packages/canon/src/css';
const destination = '../public';

const source1 = path.join(__dirname, `${source}/styles.css`);
const destination1 = path.join(__dirname, `${destination}/styles.css`);

// Function to bundle and copy the CSS file
const bundleAndCopyFile = async (source, destination) => {
  try {
    const result = await bundle({
      filename: source,
      minify: false,
    });

    fs.writeFileSync(destination, result.code);
    console.log('File bundled and copied successfully!');
  } catch (err) {
    console.error('Error bundling file:', err);
  }
};

// Initial bundle and copy
Promise.all([bundleAndCopyFile(source1, destination1)])
  .then(() => {
    // Add an empty line after all operations are complete - It looks better in the terminal :)
    console.log('');
  })
  .catch(err => {
    console.error('Error in processing files:', err);
  });
