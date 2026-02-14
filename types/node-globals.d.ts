/**
 * Minimal Node.js globals for lib code that runs in API routes.
 * For full types, ensure @types/node is installed (npm install).
 */
declare global {
  interface Buffer extends Uint8Array {}
  var Buffer: BufferConstructor;
  interface BufferConstructor {
    from(input: ArrayBuffer | ArrayBufferView | string, encoding?: string): Buffer;
    isBuffer(value: unknown): value is Buffer;
    prototype: Buffer;
  }
  function require(module: string): unknown;
}

export {};
