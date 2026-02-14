declare module 'mammoth' {
  interface ExtractRawTextResult {
    value: string;
    messages: Array<{ type: string; message: string; location?: unknown }>;
  }

  function extractRawText(options: { buffer: Buffer }): Promise<ExtractRawTextResult>;

  const defaultExport: {
    extractRawText: typeof extractRawText;
  };
  export = defaultExport;
}
