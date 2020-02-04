import React from 'react';

/**
 * Takes a typical metadata value of an object and turns it into something renderable. This is
 * useful for example when rendering component facts and similar user-entered free form data.
 *
 * @param value A single value
 * @param nilRepr an element or string used to represent nil value or empty array (wrapped in a div), by default an empty string
 * @returns {object} A renderable item, such as a string, a number or an element.
 */
export function metadataValueToElement(value: any, nilRepr = '') {
  if (!value) {
    return nilRepr;
  }

  if (typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'string' || Number.isFinite(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <div>{nilRepr}</div>;
    } else {
      return (
        <div>
          {value.map((item, index) => (
            <div key={index} className="metadata-array-item">
              {metadataValueToElement(item, nilRepr)}
            </div>
          ))}
        </div>
      );
    }
  }

  if (typeof value === 'object') {
    return (
      <div>
        {Object.entries(value).map(([itemKey, itemValue]) => (
          <div key={itemKey}>
            <span className="metadata-object-key">{metadataValueToElement(itemKey, nilRepr)}:</span>
            <span className="metadata-object-value">{metadataValueToElement(itemValue, nilRepr)}</span>
          </div>
        ))}
      </div>
    );
  }

  return '(unknown value type)';
}
