function toCamelCase(str: string): string {
  return str.replace(/_([a-zA-Z])/g, (_, c) => (c ? c.toUpperCase() : ''));
}

export function camelCaseKeys<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const camelKey = toCamelCase(key);
    const value = obj[key];

    if (value instanceof Date) {
      result[camelKey] = value;
      continue;
    }

    result[camelKey] = value;
  }

  return result as T;
}
