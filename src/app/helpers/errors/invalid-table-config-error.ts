export class InvalidTableConfigError extends Error {
  constructor(tableHeaders: string[], tableKeys: unknown[]) {
    super(
      `Invalid Table Configuration\nTable Headers = ${tableHeaders}\nTable Keys = ${tableKeys}`
    );
  }
}
