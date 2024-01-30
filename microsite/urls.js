var sidebars = require('./sidebars.json');

function extractUrls(obj, prefix = '') {
  let urls = [];

  if (obj.type === 'category' && Array.isArray(obj.items)) {
    urls = urls.concat(obj.items.map(url => `/${url}`));
  } else {
    for (const key in obj) {
      const currentPrefix = prefix.length ? `${prefix}` : key;

      if (Array.isArray(obj[key])) {
        urls = urls.concat(
          obj[key].map(url => {
            if (typeof url != 'object') {
              return `/${currentPrefix}/${url}`;
            } else {
              return extractUrls(obj[key], currentPrefix);
            }
          }),
        );
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        urls = urls.concat(extractUrls(obj[key], currentPrefix));
      }
    }
  }

  return urls.filter(url => typeof url === 'string' && url.startsWith('/'));
}

module.exports = {
  allUrls: extractUrls(sidebars).map(path => `http://localhost:3000${path}`),
};
