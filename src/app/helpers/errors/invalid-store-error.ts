export class InvalidStoreError extends Error {
  constructor(key: unknown, value: unknown, reason?: string) {
    super(`${reason ?? 'Invalid store data'}\nkey: ${key}\n value: ${value}`);
  }
}
