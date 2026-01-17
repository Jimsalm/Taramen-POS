export function nestedObjParser(obj, path) {
  if (!obj || !path) return null;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return null;
    }
    current = current[key];
  }
  
  return current;
}

export function setNestedValue(obj, path, value) {
  if (!obj || !path) return obj;
  
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
}
