declare module 'pdf-lib' {
  export interface RGB {
    red: number;
    green: number;
    blue: number;
  }

  export function rgb(red: number, green: number, blue: number): RGB;

  export const StandardFonts: {
    Helvetica: symbol | string;
    HelveticaBold: symbol | string;
  };

  export interface PDFFont {
    // minimal for embedFont return type
  }

  export interface PDFPage {
    drawText(text: string, options: {
      x: number;
      y: number;
      size: number;
      font: PDFFont;
      color: RGB;
    }): void;
  }

  export interface PDFDocument {
    addPage(dimensions: [number, number]): PDFPage;
    embedFont(font: unknown): Promise<PDFFont>;
    getPage(index: number): PDFPage;
    getPageCount(): number;
    save(): Promise<Uint8Array>;
  }

  export const PDFDocument: {
    create(): Promise<PDFDocument>;
  };
}
