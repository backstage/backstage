export interface SpecParser {
  specType: string;
  getSpecText(specDefinition: any): string;
}

export class SpecHandler {
  specParsers: Record<string, SpecParser> = {};

  addSpecParser(parser: SpecParser) {
    this.specParsers[parser.specType] = parser;
  }

  getSpecParser(specType: string): SpecParser {
    return this.specParsers[specType];
  }
}
