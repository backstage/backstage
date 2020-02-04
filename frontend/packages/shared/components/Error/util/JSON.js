/*
 * safeStringify is JSON.stringify that will not stringify cycles in the object graph.
 *
 * See: https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
 */
export function safeStringify(object, tab) {
  let cache = [];

  return JSON.stringify(
    object,
    function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Duplicate reference found
          try {
            // If this value does not reference a parent it can be deduped
            return JSON.parse(JSON.stringify(value));
          } catch (error) {
            // discard key if value cannot be deduped
            return;
          }
        }
        // Store value in our collection
        cache.push(value);
      }

      return value;
    },
    tab,
  );
}
